import mongoose, { Schema, SchemaTypes } from "mongoose";

const FeedbackSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["positive", "negative"],
      required: true,
    },
    comments: { type: String },
    categoryId: { type: SchemaTypes.ObjectId, required: true },
    messageId: { type: SchemaTypes.ObjectId, unique: true, required: true }
  },
  { timestamps: true }
);

const Feedback = mongoose.model("feedback", FeedbackSchema);

export default Feedback;
