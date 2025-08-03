import { Document, ObjectId } from "mongoose";

// Address Interface for TypeScript
export interface IAddressDocument extends Document {
  _id: string;
  type: ObjectId;
  country: string;
  city: string;
  zipCode: string;
  street: string;
  number: string;
  additionalInfo?: string;
}
