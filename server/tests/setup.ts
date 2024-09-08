import mongoServer from "../setupMongoTest";
import bcrypt from "bcrypt";
import User from "../models/user";
import mongoose from "mongoose";
import { ChromaClient } from "chromadb";
import Chat from "../models/chat";
import Message from "../models/message";
import Category from "../models/categories";

const chromaClient = new ChromaClient();
let collectionId = crypto.randomUUID();

beforeAll(async () => {
    await chromaClient.createCollection({ name: collectionId });

    await new Promise(resolve => {
        mongoose.connection.on("open", async () => {
            const salt = bcrypt.genSaltSync();
            const hashedPassword = bcrypt.hashSync("12345678", salt);
            // create admin user
            await User.create({ firstName: "test", lastName: "test", email: "admin@gmail.com", password: hashedPassword, isAdmin: true, });

            const user = await User.create({ firstName: "John", lastName: "Cena", email: "john@gmail.com", password: hashedPassword });
            const chat = await Chat.create({ name: "chat", index: collectionId, userId: user._id });

            await Message.create({ prompt: "What?", response: "Why?", chatId: chat._id, userId: user._id });

            await Promise.all(["correct", "easy-to-understand", "complete", "other", "offensive/unsafe", "not-factually-correct"].map(name => Category.create({ name })));

            resolve(0);
        });
    })
})

afterAll(async () => {
    await chromaClient.deleteCollection({ name: collectionId });
});

export { mongoServer };