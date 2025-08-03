import mongoose, { Schema, Types } from "mongoose";
import { IAccountDocument } from "../Interfaces/accounts.interface.js";

// Mongoose User Schema
const AccountSchema = new Schema<IAccountDocument>(
  {
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    }, // default "user"
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmed: { type: Boolean, default: false }, // default false
    createdAt: { type: Date },
    personalData: { type: Types.ObjectId, required: false }, // optional
  },
  {
    timestamps: true,
    collection: "accounts",
  }
); // added timestamps

const AccountModel = mongoose.model<IAccountDocument>("Account", AccountSchema); // create User model

export default AccountModel; // export default UserModel
