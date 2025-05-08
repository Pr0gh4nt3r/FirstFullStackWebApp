import mongoose, { Schema, Types } from "mongoose";
import { IPhones, IPhoneTypes } from "../Interfaces/phones.interface.js";

const PhonesTypesSchema = new Schema<IPhoneTypes>(
  {
    type: { type: String, required: true },
    description: { type: String, required: true },
  },
  // added timestamps
  {
    timestamps: true,
    collection: "phoneTypes",
  }
);

const PhonesDataSchema = new Schema<IPhones>(
  {
    type: { type: Types.ObjectId, required: true },
    number: { type: String, required: true },
  },
  // added timestamps
  {
    timestamps: true,
    collection: "phones",
  }
);

// create and export PhoneTypes model
export const PhonesTypesModel = mongoose.model<IPhoneTypes>(
  "PhonesTypes",
  PhonesTypesSchema
);

const PhonesDataModel = mongoose.model<IPhones>("PhonesData", PhonesDataSchema);

export default PhonesDataModel; // export default PhonesTypesModel
