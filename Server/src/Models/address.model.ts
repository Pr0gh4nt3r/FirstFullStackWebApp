import mongoose, { Schema, Document } from "mongoose";

// Address Interface für TypeScript
export interface AddressDocument extends Document {
  country: string;
  city: string;
  zipCode: string;
  street: string;
  number: number;
  additionalInfo?: string;
}

// Mongoose Address Schema
export const AddressSchema = new Schema<AddressDocument>(
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

const AddressModel = mongoose.model<AddressDocument>("Address", AddressSchema);
export default AddressModel;
