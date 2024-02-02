import express from "express";
import { createChat } from "../controllers/chatController";

const router = express.Router();

router.post("/", createChat);

export default router;
