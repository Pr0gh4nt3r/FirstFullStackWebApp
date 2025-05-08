import { ObjectId } from "mongoose";

// PhoneTypes Interface for TypeScript
export interface IPhoneTypes {
  _id: ObjectId;
  key: string;
  description: string;
}

// PersonalDataPhones Interface for TypeScript
export interface IPhones {
  _id: ObjectId;
  type: ObjectId;
  number: string;
}
