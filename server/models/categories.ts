import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema({
  name: {
    type: String,
    enum: [
      "correct",
      "easy-to-understand",
      "complete",
      "offensive/unsafe",
      "not-factually-correct",
      "other",
    ],
    required: true,
  },
});

const Category = mongoose.model("category", CategorySchema);

export default Category;
