import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String },
});

const User = mongoose.model("user", UserSchema);

export default User;
