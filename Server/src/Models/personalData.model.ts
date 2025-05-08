import mongoose, { Schema, Types } from "mongoose";
import { IPersonalData } from "../Interfaces/personalData.interface copy.js";

// Mongoose PersonalData Schema
const PersonalDataSchema = new Schema<IPersonalData>(
  {
    firstName: { type: String, required: true },
    middleNames: { type: String, required: false },
    lastName: { type: String, required: true },
    birthName: { type: String, required: false },
    birthday: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    phones: [{ type: Types.ObjectId, ref: "phones", required: false }], // array of ojectId references
    addresses: [{ type: Types.ObjectId, ref: "addresses", required: false }], // array of ojectId references
  },
  // added timestamps
  {
    timestamps: true,
    collection: "personalData",
  }
);

// create PhonesData model
const PersonalDataModel = mongoose.model<IPersonalData>(
  "PersonalData",
  PersonalDataSchema
);

export default PersonalDataModel; // export default PersonalDataModel
