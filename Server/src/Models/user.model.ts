import mongoose, { Schema, Types } from "mongoose";
import {
  IPersonalData,
  IPersonalDataPhones,
  IPhoneTypes,
  IUserDocument,
} from "../Interfaces/user.interface.js";

const PhonesTypesSchema = new Schema<IPhoneTypes>(
  {
    type: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "numberTypes",
  }
); // Fügt createdAt und updatedAt hinzu

const PhonesDataSchema = new Schema<IPersonalDataPhones>(
  {
    type: { type: Types.ObjectId, required: true },
    number: { type: String, required: true },
  },
  { _id: false } // Verhindert, dass Mongoose eine _id für jedes Element im Array erstellt
);

// Mongoose PersonalData Schema
const PersonalDataSchema = new Schema<IPersonalData>(
  {
    firstName: { type: String, required: true },
    secondName: { type: String, required: false },
    lastName: { type: String, required: true },
    birthName: { type: String, required: false },
    birthday: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    phones: [
      { type: PhonesDataSchema, required: false }, // Array von Objekten
    ], // Array von ObjectId-Referenzen
    addresses: [{ type: Types.ObjectId, ref: "addresses", required: false }], // Array von ObjectId-Referenzen
  },
  {
    timestamps: true,
    collection: "personalData",
  }
);

// Mongoose User Schema
const UserSchema = new Schema<IUserDocument>(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    personalData: { type: Types.ObjectId, required: false }, // Optionales Feld
  },
  {
    timestamps: true,
    collection: "users",
  }
); // Fügt createdAt und updatedAt hinzu

// Modell exportieren
const UserModel = mongoose.model<IUserDocument>("User", UserSchema);
export default UserModel;
