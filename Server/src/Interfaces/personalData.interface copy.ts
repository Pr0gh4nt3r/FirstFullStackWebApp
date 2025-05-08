import { ObjectId } from "mongoose";

// PhoneTypes Interface for TypeScript
export interface IPhoneTypes {
  type: string;
  description: string;
}

// PersonalDataPhones Interface for TypeScript
export interface IPersonalDataPhones {
  type: ObjectId;
  number: string;
}

// PersonalData Interface for TypeScript
export interface IPersonalData {
  _id: string;
  firstName: string;
  secondName?: string;
  lastName: string;
  birthName?: string;
  birthday: Date;
  gender: "male" | "female" | "other";
  phones?: ObjectId[];
  addresses?: ObjectId[];
}
