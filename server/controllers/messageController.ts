import validateParams from "../middleware/validateParams";
import validateQuery from "../middleware/validateQuery";
import Message from "../models/message";
import { asyncHandler } from "../utils/asyncHandler";
import { ChatIDSchema, PaginatedQuerySchema } from "../utils/schema";

const PAGE_LIMIT = 5;

export const getMessages = [
  validateParams(ChatIDSchema),
  validateQuery(PaginatedQuerySchema),
  asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const { page = 1 } = req.query;

    const skip = (+page - 1) * PAGE_LIMIT;

    const messages = await Message.find({ chatId })
      .skip(skip)
      .limit(PAGE_LIMIT);
      
    res.json(messages);
  }),
];
