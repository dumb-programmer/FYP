import mongoose, { Schema } from "mongoose";

const ChatSchema = new Schema({
  name: { type: String },
  index: { type: String, require: true },
  userId: { type: Schema.ObjectId, require: true },
});

const Chat = mongoose.model("chat", ChatSchema);

export default Chat;