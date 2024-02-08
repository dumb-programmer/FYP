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
import isAuthenticated from "../middleware/isAuthenticated";

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

const promptTemplate = PromptTemplate.fromTemplate(`Context:
  {context}
  
  Prompt:
  {question}
  
  Instruction:
  Please use the provided context to answer the questions. Ensure that your responses are clear, concise, and contextually relevant. Feel free to provide explanations or additional details when necessary. If the context is empty or does not contains the necessary information to answer the question, say that the context does not have sufficient information to answer the question`);

const model = new Ollama({
  baseUrl: "http://localhost:11434",
  model: "Modelfile:latest",
});

export const createChat = [
  upload,
  asyncHandler(async (req, res) => {
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
    await Chat.create({
      name: "Test",
      index: collectionName,
    });
    return res.sendStatus(200);
  }),
];

export const query = asyncHandler(async (req, res) => {
  const { prompt } = req.query;
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
  for await (const item of result) {
    res.write(item);
  }
  res.end();
});

export const getChats = [
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const chats = await Chat.find({ userId: req.user._id });
    res.json(chats);
  }),
]
