import { ObjectId, Document } from "mongoose";

// PersonalData Interface für TypeScript
export interface IPersonalData {
  firstName: string;
  secondName?: string;
  lastName: string;
  birthName?: string;
  birthday: Date;
  gender: "male" | "female" | "other";
  phone?: string;
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
