import express from "express";
import {
  createChat,
  deleteChat,
  getChats,
  query,
} from "../controllers/chatController";
import { getMessages } from "../controllers/messageController";

const router = express.Router();

router.get("/", getChats);
router.post("/", createChat);
router.post("/:chatId", query);
router.delete("/:chatId", deleteChat);
router.get("/:chatId/messages", getMessages);

export default router;
