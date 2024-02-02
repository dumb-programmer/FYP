import express from "express";
import { createChat, query } from "../controllers/chatController";

const router = express.Router();

router.post("/", createChat);
router.get("/:chatId", query);

export default router;
