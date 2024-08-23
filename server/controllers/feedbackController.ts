import validateReq from "../middleware/validateReq";
import Category from "../models/categories";
import Feedback from "../models/feedback";
import Message from "../models/message";
import { asyncHandler } from "../utils/asyncHandler";
import { FeedbackSchema } from "../utils/schema";

export const createFeedback = [
    validateReq(FeedbackSchema),
    asyncHandler(async (req, res) => {
        const { type, comments, category, messageId } = req.body;

        const feedback = await Feedback.findOne({ messageId });

        if (feedback) {
            return res.status(409).json({ message: "A feedback for this message was already provided" });
        }

        const message = await Message.findById(messageId);

        if (!message || message.userId.toString() !== req.user?._id) {
            return res.status(404).json({ message: "No message with this id exists" });
        }

        const categoryDB = await Category.findOne({ name: category });

        await Feedback.create({ type, comments, categoryId: categoryDB?._id, messageId });

        return res.json(201).json({ message: "Feedback submitted" });
    }),
];

export const getAllFeedbacks = [
    asyncHandler(async (req, res) => {
        const feedback = await Feedback.find();

        return res.json(feedback);
    })
]