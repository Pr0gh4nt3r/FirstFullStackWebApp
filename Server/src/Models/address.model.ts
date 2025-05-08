import mongoose, { Schema, Types } from "mongoose";

import { IAddressDocument } from "../Interfaces/address.interface.js";

// Mongoose Address Schema
export const AddressSchema = new Schema<IAddressDocument>(
  {
    type: { type: Types.ObjectId, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    street: { type: String, required: true },
    number: { type: String, required: true },
    additionalInfo: { type: String, required: false },
  },
  // added timestamps
  {
    timestamps: true,
    collection: "addresses",
  }
);

const AddressModel = mongoose.model<IAddressDocument>("Address", AddressSchema); // create Address model

export default AddressModel; // export default AddressModel
