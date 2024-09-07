import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, unique: true },
  username: { type: String },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  isAdmin: { type: Boolean },
  isBlocked: { type: Boolean }
});

const User = mongoose.model("user", UserSchema);

export default User;
