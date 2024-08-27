import mongoServer from "../setupMongoTest";
import bcrypt from "bcrypt";
import User from "../models/user";
import mongoose from "mongoose";

beforeAll(async () => {
    await new Promise(resolve => {
        mongoose.connection.on("open", async () => {
            const salt = bcrypt.genSaltSync();
            const hashedPassword = bcrypt.hashSync("12345678", salt);
            await User.create({ firstName: "John", lastName: "Cena", email: "john@gmail.com", password: hashedPassword });
            resolve(0);
        });
    })
})

export { mongoServer };