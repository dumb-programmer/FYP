import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

export default (async () => {
    const mongoServer = await MongoMemoryServer.create();
    const mongoURI = mongoServer.getUri();

    mongoose.connect(mongoURI);

    mongoose.connection.on("error", e => {
        console.log(e);
        if (e.message.code === "ETIMEDOUT") {
            mongoose.connect(mongoURI);
        }
    });

    mongoose.connection.on("close", async () => {
        await mongoServer.stop();
    });

    return mongoServer;
})()