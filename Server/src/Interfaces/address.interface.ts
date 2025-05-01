import { Document } from "mongoose";

// Address Interface für TypeScript
export interface IAddressDocument extends Document {
  country: string;
  city: string;
  zipCode: string;
  street: string;
  number: number;
  additionalInfo?: string;
}
