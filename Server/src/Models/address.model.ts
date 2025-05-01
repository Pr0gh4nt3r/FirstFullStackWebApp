import mongoose, { Schema } from "mongoose";

import { IAddressDocument } from "../Interfaces/address.interface.js";

// Mongoose Address Schema
export const AddressSchema = new Schema<IAddressDocument>(
  {
    country: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    street: { type: String, required: true },
    number: { type: Number, required: true },
    additionalInfo: { type: String, required: false },
  },
  {
    timestamps: true,
    collection: "addresses",
  }
); // Fügt createdAt und updatedAt hinzu);

const AddressModel = mongoose.model<IAddressDocument>("Address", AddressSchema);
export default AddressModel;
