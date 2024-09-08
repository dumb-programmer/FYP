import { ChromaClient } from "chromadb";
import validateQuery from "../middleware/validateQuery";
import Chat from "../models/chat";
import User from "../models/user";
import { asyncHandler } from "../utils/asyncHandler";
import { PaginatedQuerySchema, UserIdSchema } from "../utils/schema";
import Message from "../models/message";
import validateParams from "../middleware/validateParams";

export const getAllUsers = [
    validateQuery(PaginatedQuerySchema),
    asyncHandler(async (req, res) => {
        const { page = 1, limit = 10 } = req.query;

        const skip = (+page - 1) * +limit;

        const users = await User.find({ isAdmin: undefined }, { firstName: true, lastName: true, email: true, username: true, isBlocked: true, }).skip(skip).limit(+limit + 1);

        const total = Math.ceil((await User.countDocuments()) / +limit);

        res.json({
            rows: users.slice(0, +limit),
            nextPage: +page + 1,
            hasMore: users.length > +limit,
            total,
        });
    })
];

export const blockUser = [
    validateParams(UserIdSchema),
    asyncHandler(async (req, res) => {
        const { userId } = req.params;

        const user = await User.updateOne({ _id: userId, isAdmin: { $ne: true } }, { $set: { isBlocked: true } });

        if (user.matchedCount === 0) {
            return res.status(404).json({ message: "No user with this id exists" })
        }

        return res.status(200).json({ message: "User blocked" });
    })
];

export const unblockUser = [
    validateParams(UserIdSchema),
    asyncHandler(async (req, res) => {
        const { userId } = req.params;

        const user = await User.updateOne({ _id: userId, isAdmin: { $ne: true } }, { $unset: { isBlocked: true } });

        if (user.matchedCount === 0) {
            return res.status(404).json({ message: "No user with this id exists" })
        }

        return res.status(200).json({ message: "User unblocked" });
    })
];

export const deleteUser = [
    validateParams(UserIdSchema),
    asyncHandler(async (req, res) => {
        const { userId } = req.params;
        
        const user = await User.deleteOne({ _id: userId, isAdmin: { $ne: true } });

        if (user.deletedCount === 0) {
            return res.status(404).json({ message: "No user with this id exists" });
        }

        const chats = await Chat.find({ userId });

        const chromaClient = new ChromaClient();

        await Promise.all(chats.map(chat => chromaClient.deleteCollection({ name: chat.index })));

        await Message.deleteMany({ userId });
        await Chat.deleteMany({ userId });

        return res.status(200).json({ message: "User deleted successfully" });
    })
];