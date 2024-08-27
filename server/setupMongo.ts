import mongoose from "mongoose";

(async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_CONNECTION_STRING as string
        );
        console.log("Connected to database");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();