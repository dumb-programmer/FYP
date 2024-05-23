import express from "express";
import {
  createChat,
  deleteChat,
  editChat,
  getChatName,
  getChats,
  query,
} from "../controllers/chatController";
import { deleteMessage, getMessages } from "../controllers/messageController";

const router = express.Router();

router.get("/", getChats);
router.post("/", createChat);
router.get("/:chatId/name", getChatName);
router.post("/:chatId", query);
router.delete("/:chatId", deleteChat);
router.patch("/:chatId", editChat);

router.get("/:chatId/messages", getMessages);
router.delete("/:chatId/messages/:messageId", deleteMessage);

export default router;
