import mongoose, { Schema } from "mongoose";
import { ObjectId } from "mongodb";

import { ITokenRevocationDocument } from "../Interfaces/tokenRevocations.interface.js";

const tokenRevocation = new Schema<ITokenRevocationDocument>(
  {
    tokenId: { type: ObjectId, required: true, unique: true }, // The ID of the token being revoked
    revokedAt: { type: Date, required: true }, // The date and time when the token was revoked
    revokedBy: { type: Object, required: true }, // The revoker information,
    revokeReason: { type: String, required: true }, // reason for revocation
    replacedByTokenId: { type: ObjectId }, // Optional field for
  },
  {
    collection: "tokenRevocations",
  }
); // Fügt createdAt und updatedAt hinzu

// Modell exportieren
const tokenRevocationModel = mongoose.model<ITokenRevocationDocument>(
  "TokenRevocation",
  tokenRevocation
);
export default tokenRevocationModel;
