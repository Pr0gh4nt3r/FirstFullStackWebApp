import mongoose, { Schema, Document } from "mongoose";
import { IRefreshTokenDocument } from "../Interfaces/token.interface.js";

const refreshToken = new Schema<IRefreshTokenDocument>(
  {
    refreshToken: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    collection: "tokens",
  }
); // Fügt createdAt und updatedAt hinzu

// Modell exportieren
const tokenModel = mongoose.model<IRefreshTokenDocument>("Token", refreshToken);
export default tokenModel;
