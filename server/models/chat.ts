import mongoose, { Schema } from "mongoose";

const ChatSchema = new Schema(
  {
    name: { type: String },
    index: { type: String, required: true },
    userId: { type: Schema.ObjectId, required: true },
  },
  { timestamps: true }
);

const Chat = mongoose.model("chat", ChatSchema);

export default Chat;
