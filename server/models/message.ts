import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    chatId: { type: Schema.ObjectId, required: true },
    userId: { type: Schema.ObjectId, required: true },
  },
  { timestamps: true }
);

MessageSchema.index({ response: "text", prompt: "text" });

const Message = mongoose.model("message", MessageSchema);

export default Message;
