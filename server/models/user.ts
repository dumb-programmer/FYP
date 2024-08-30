import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, unique: true },
  username: { type: String, required: false },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String, values: ["admin"] }
});

const User = mongoose.model("user", UserSchema);

export default User;
