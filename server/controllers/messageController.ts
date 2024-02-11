import Message from "../models/message";
import { asyncHandler } from "../utils/asyncHandler";

export const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const messages = await Message.find({ chatId });
  res.json(messages);
});
