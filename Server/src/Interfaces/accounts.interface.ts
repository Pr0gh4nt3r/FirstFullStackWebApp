import { Document, ObjectId } from "mongoose";
import { IPersonalData } from "./personalData.interface copy.js";

// User Interface for TypeScript
export interface IAccountDocument extends Document {
  _id: ObjectId;
  role: "user" | "admin"; // alternative way to define roles
  userName: string;
  email: string;
  password: string;
  confirmed?: boolean;
  createdAt: Date;
  personalData?: IPersonalData; // optional
}
