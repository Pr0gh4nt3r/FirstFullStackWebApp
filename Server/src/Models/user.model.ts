import mongoose, { Schema, Types } from "mongoose";
import { IPersonalData, IUserDocument } from "../Interfaces/user.interface.js";

// Mongoose PersonalData Schema
const PersonalDataSchema = new Schema<IPersonalData>(
  {
    firstName: { type: String, required: true },
    secondName: { type: String, required: false },
    lastName: { type: String, required: true },
    birthName: { type: String, required: false },
    birthday: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    phone: { type: String, required: false },
    addresses: [{ type: Types.ObjectId, ref: "addresses", required: false }], // Array von ObjectId-Referenzen
  },
  { _id: false }
);

// Mongoose User Schema
const UserSchema = new Schema<IUserDocument>(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    personalData: { type: PersonalDataSchema, required: false }, // Optionales Feld
  },
  {
    timestamps: true,
    collection: "users",
  }
); // Fügt createdAt und updatedAt hinzu

// Modell exportieren
const UserModel = mongoose.model<IUserDocument>("User", UserSchema);
export default UserModel;
