import { ObjectId } from "mongoose";

export interface IRefreshTokenDocument extends Document {
  token: string;
  revoked: boolean;
  revocationId?: ObjectId; // Optional field for a unique revocation identifier
}
