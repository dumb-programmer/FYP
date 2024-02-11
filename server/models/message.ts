import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema({
  prompt: { type: String, require: true },
  response: { type: String, require: true },
  chatId: { type: Schema.ObjectId, require: true },
  userId: { type: Schema.ObjectId, require: true },
});

const Message = mongoose.model("message", MessageSchema);

export default Message;
