import { ObjectId } from "mongoose";

export interface ITokenRevocationDocument extends Document {
  tokenId: ObjectId; // The ID of the token being revoked
  revokedAt: Date; // The date and time when the token was revoked
  revokedBy: Object; // The revoker information, e.g., user ID or admin ID
  revokeReason: string; // reason for revocation
  replacedByTokenId?: ObjectId; // Optional field for the ID of the token that replaces the revoked token
}
