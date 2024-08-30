import isAdmin from "../middleware/isAdmin";
import validateQuery from "../middleware/validateQuery";
import validateReq from "../middleware/validateReq";
import Category from "../models/categories";
import Feedback from "../models/feedback";
import Message from "../models/message";
import { asyncHandler } from "../utils/asyncHandler";
import { FeedbackSchema, PaginatedQuerySchema } from "../utils/schema";

export const createFeedback = [
    validateReq(FeedbackSchema),
    asyncHandler(async (req, res, next) => {
        const { type, comments, category, messageId } = req.body;

        try {
            const message = await Message.findById(messageId);

            if (!message || message.userId.toString() !== req.user?._id) {
                return res.status(404).json({ message: "No message with this id exists" });
            }

            const categoryDB = await Category.findOne({ name: category });

            await Feedback.create({ type, comments, categoryId: categoryDB?._id, messageId });

            return res.status(201).json({ message: "Feedback submitted" });

        } catch (error: any) {
            if (error.code && error.code === 11000) {
                return res.status(409).json({ message: "A feedback for this message was already provided" });
            }
            next(error);
        }
    }),
];

export const getAllFeedbacks = [
    validateQuery(PaginatedQuerySchema),
    isAdmin,
    asyncHandler(async (req, res) => {
        const { page = 1, limit = 10 } = req.query;

        const skip = (+page - 1) * +limit;

        const feedbacks = await Promise.all((
            await Feedback.find()
                .skip(skip)
                .limit(+limit + 1)).map(async (feedback) => {
                    const [message, category] = await Promise.all([
                        Message.findById(feedback.messageId, { prompt: true, response: true }),
                        Category.findById(feedback.categoryId)
                    ]);

                    return { ...feedback.toObject(), ...message?.toObject(), category: category?.name }

                }));

        const total = Math.ceil((await Feedback.countDocuments()) / +limit);

        res.json({
            feedbacks: feedbacks.slice(0, +limit),
            nextPage: +page + 1,
            hasMore: feedbacks.length > +limit,
            total,
        });
    })
]