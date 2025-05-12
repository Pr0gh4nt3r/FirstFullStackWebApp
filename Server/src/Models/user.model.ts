import mongoose, { Schema, Types } from "mongoose";
import { IUserDocument } from "../Interfaces/user.interface.js";

// Mongoose User Schema
const UserSchema = new Schema<IUserDocument>(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmed: { type: Boolean, default: false }, // default false
    createdAt: { type: Date },
    personalData: { type: Types.ObjectId, required: false }, // optional
  },
  {
    timestamps: true,
    collection: "users",
  }
); // added timestamps

const UserModel = mongoose.model<IUserDocument>("User", UserSchema); // create User model

export default UserModel; // export default UserModel
