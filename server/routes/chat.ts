import express from "express";
import { createChat, getChats, query } from "../controllers/chatController";

const router = express.Router();

router.get("/", getChats);
router.post("/", createChat);
router.get("/:chatId", query);

export default router;
