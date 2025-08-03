import { ObjectId } from "mongoose";

export interface IRevokedBy {
  userId: ObjectId; // assuming the revokedBy is the user id
  role: "user" | "admin"; // assuming the revokedBy contains the user role
  userName: string; // assuming the revokedBy contains the user name
  service: string; // service that revoked the token
  ip: string; // the ip address of the maschine that revoked the token
  userAgent: string; // the user agent of the maschine that revoked the token
  deviceId: string; // the device id of the maschine that revoked the token
}
