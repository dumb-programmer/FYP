import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import multer from "multer";
import Chat from "../models/chat";
import { asyncHandler } from "../utils/asyncHandler";

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
