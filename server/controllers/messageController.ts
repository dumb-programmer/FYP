import validateParams from "../middleware/validateParams";
import validateQuery from "../middleware/validateQuery";
import Feedback from "../models/feedback";
import Message from "../models/message";
import { asyncHandler } from "../utils/asyncHandler";
import { ChatIDSchema, PaginatedQuerySchema } from "../utils/schema";

const PAGE_LIMIT = 5;

export const getMessages = [
  validateParams(ChatIDSchema),
  validateQuery(PaginatedQuerySchema),
  asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const { page = 1, query } = req.query;

    const skip = (+page - 1) * PAGE_LIMIT;

    const searchDoc = query
      ? { chatId, $text: { $search: query } }
      : { chatId };

    const messages = await Promise.all(
      (await Message.find(searchDoc)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(PAGE_LIMIT + 1)
      ).map(async message => {
        const feedback = await Feedback.findOne({ messageId: message._id });
        if (feedback) {
          return { ...message._doc, feedback: { [feedback.type]: true } }
        }
        return message;
      })
    );

    console.log(messages);

    res.json({
      messages: messages.slice(0, PAGE_LIMIT),
      nextPage: +page + 1,
      hasMore: messages.length > PAGE_LIMIT,
    });
  }),
];

export const deleteMessage = [
  validateParams(ChatIDSchema),
  asyncHandler(async (req, res) => {
    const { chatId, messageId } = req.params;

    const result = await Message.deleteOne({
      _id: messageId,
      chatId,
      userId: req.user._id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.status(200).json({ message: "Message deleted successfully" });
  }),
];
