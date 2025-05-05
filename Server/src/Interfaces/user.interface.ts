import { ObjectId, Document } from "mongoose";

export interface IPhoneTypes {
  type: string;
  description: string;
}

export interface IPersonalDataPhones {
  type: ObjectId;
  number: string;
}

// PersonalData Interface für TypeScript
export interface IPersonalData {
  firstName: string;
  secondName?: string;
  lastName: string;
  birthName?: string;
  birthday: Date;
  gender: "male" | "female" | "other";
  phones?: ObjectId[];
  addresses?: ObjectId[];
}

// User Interface für TypeScript
export interface IUserDocument extends Document {
  userName: string;
  email: string;
  password: string;
  confirmed?: boolean;
  personalData?: IPersonalData; // personalData ist jetzt optional
}
