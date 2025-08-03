import mongoose, { Schema } from "mongoose";
import { ObjectId } from "mongodb";

import { IRefreshTokenDocument } from "../Interfaces/refreshTokens.interface.js";

const refreshToken = new Schema<IRefreshTokenDocument>(
  {
    token: { type: String, required: true, unique: true },
    revoked: { type: Boolean, default: false }, // Fügt ein Feld hinzu, um zu verfolgen, ob der Token widerrufen wurde
    revocationId: { type: ObjectId }, // Optionales Feld für einen eindeutigen Widerrufsbezeichner
  },
  {
    timestamps: true,
    collection: "refreshTokens",
  }
); // Fügt createdAt und updatedAt hinzu

// Modell exportieren
const tokenModel = mongoose.model<IRefreshTokenDocument>(
  "RefreshToken",
  refreshToken
);
export default tokenModel;
