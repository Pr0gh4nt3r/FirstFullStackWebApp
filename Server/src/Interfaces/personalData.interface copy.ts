import { ObjectId } from "mongoose";

// PhoneTypes Interface for TypeScript
export interface IPhoneTypes {
  _id: ObjectId;
  type: string;
  description: string;
}

// PersonalDataPhones Interface for TypeScript
export interface IPersonalDataPhones {
  _id: ObjectId;
  type: ObjectId;
  number: string;
}

// PersonalData Interface for TypeScript
export interface IPersonalData {
  _id: ObjectId;
  firstName: string;
  middleNames?: string;
  lastName: string;
  birthName?: string;
  birthday: Date;
  gender: "male" | "female" | "other";
  phones?: ObjectId[];
  addresses?: ObjectId[];
}
