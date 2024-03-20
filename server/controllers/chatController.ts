import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { Ollama } from "@langchain/community/llms/ollama";
import multer from "multer";
import Chat from "../models/chat";
import { formatDocumentsAsString } from "langchain/util/document";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { asyncHandler } from "../utils/asyncHandler";
import Message from "../models/message";
import { ChromaClient } from "chromadb";
import validateReq from "../middleware/validateReq";
import { ChatIDSchema, ChatSchema, QuerySchema } from "../utils/schema";
import { NextFunction, Request, Response } from "express";
import validateParams from "../middleware/validateParams";

const chromaClient = new ChromaClient({ path: "http://localhost:8000" });
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const type = file.mimetype.split("/")[1];
    if (type === "pdf") {
      cb(null, true);
      return;
    }
    cb(new Error("Unsupported file"));
  },
}).single("document");

const embeddings = new HuggingFaceInferenceEmbeddings({
  model: "sentence-transformers/all-MiniLM-L6-V2",
  apiKey: process.env.HUGGING_FACE_API_KEY,
});

const promptTemplate = PromptTemplate.fromTemplate(`
  Context:
  {context}
  
  Prompt:
  {question}
  
  Instruction:
  Answer the prompt using the provided context, do not include extra information.`);

const model = new Ollama({
  baseUrl: "http://localhost:11434",
  model: "mistral",
});

export const createChat = [
  upload,
  (err, req, res, next) => {
    if (/unsupported file/i.test(err.message)) {
      return res.status(400).json({
        error: { document: "unsupported file format, only PDF is supported" },
      });
    }
    next(err);
  },
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return res.status(400).json({ error: { document: "Required" } });
    }
    next();
  },
  validateReq(ChatSchema),
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const loader = new PDFLoader(new Blob([req.file?.buffer]));
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkOverlap: 200,
      chunkSize: 500,
    });
    const splitDocuments = await splitter.splitDocuments(docs);
    const collectionName = crypto.randomUUID();
    await Chroma.fromDocuments(splitDocuments, embeddings, {
      numDimensions: 384,
      collectionName,
    });
    const chat = await Chat.create({
      name,
      index: collectionName,
      userId: req.user._id,
    });
    return res.json(chat);
  }),
];

export const query = [
  validateParams(ChatIDSchema),
  validateReq(QuerySchema),
  asyncHandler(async (req, res) => {
    const { prompt } = req.body;
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    const vectorstore = await Chroma.fromExistingCollection(embeddings, {
      collectionName: chat?.index as string,
      numDimensions: 384,
    });

    const retriever = vectorstore.asRetriever();

    const chain = RunnableSequence.from([
      {
        context: retriever.pipe(formatDocumentsAsString),
        question: new RunnablePassthrough(),
      },
      promptTemplate,
      model,
      new StringOutputParser(),
    ]);
    const result = await chain.stream(prompt);
    let response = "";
    for await (const item of result) {
      res.write(item);
      response += item;
    }
    res.end();
    await Message.create({
      prompt,
      response: response,
      chatId,
      userId: req.user._id,
    });
  }),
];

export const getChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ userId: req.user._id });
  res.json(chats);
});

export const deleteChat = [
  validateParams(ChatIDSchema),
  asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.sendStatus(404);
    }
    if (chat?.userId !== req.user._id) {
      return res.sendStatus(403);
    }

    await Promise.all([
      Chat.deleteOne({ _id: chatId }),
      Message.deleteMany({ chatId }),
      chromaClient.deleteCollection({ name: chat.index as string }),
    ]);

    return res.sendStatus(200);
  }),
];

export const editChat = [
  validateParams(ChatIDSchema),
  validateReq(ChatSchema),
  asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.sendStatus(404);
    }

    if (chat.userId !== req.user._id) {
      return res.sendStatus(403);
    }

    const { name } = req.body;

    await Chat.updateOne({ _id: chatId }, { name });

    return res.sendStatus(200);
  }),
];
