import validateParams from "../middleware/validateParams";
import Message from "../models/message";
import { asyncHandler } from "../utils/asyncHandler";
import { ChatIDSchema } from "../utils/schema";

export const getMessages = [
  validateParams(ChatIDSchema),
  asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId });
    res.json(messages);
  }),
];
