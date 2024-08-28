import mongoose from "mongoose";
import { mongoServer } from "./setup";

export default async () => {
    if (mongoose.connection.readyState) {
        mongoose.disconnect();
    }

    if (mongoServer) {
        (await mongoServer).stop();
        (await mongoServer).cleanup();
    }
}