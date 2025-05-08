import { ObjectId } from "mongoose";

// PhoneTypes Interface for TypeScript
export interface IPhoneTypes {
  type: string;
  description: string;
}

// PersonalDataPhones Interface for TypeScript
export interface IPhones {
  type: ObjectId;
  number: string;
}
