import { Document } from "mongoose";

// Address Interface for TypeScript
export interface IAddressDocument extends Document {
  _id: string;
  country: string;
  city: string;
  zipCode: string;
  street: string;
  number: number;
  additionalInfo?: string;
}
