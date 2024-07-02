import mongoose from "mongoose";
import Message from "./models/message";
import "dotenv/config";

(async () => {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
})();

for (let i = 0; i < 100; i++) {
  setTimeout(() => {
    Message.create({
      prompt: "What the dog doin?",
      response: `Test ${i}`,
      chatId: "66006825b476726cb2f57398",
      userId: "65fd1930f667b860e66caff2",
    });
    console.log(`Create Test: ${i}`);
  }, 1000);
}
