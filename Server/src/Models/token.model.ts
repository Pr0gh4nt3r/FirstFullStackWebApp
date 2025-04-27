import mongoose, { Schema, Document } from "mongoose";

export interface refreshTokenDocument extends Document {
  refreshToken: string;
}

const refreshToken = new Schema<refreshTokenDocument>(
  {
    refreshToken: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    collection: "tokens",
  }
); // Fügt createdAt und updatedAt hinzu

// Modell exportieren
const tokenModel = mongoose.model<refreshTokenDocument>("Token", refreshToken);
export default tokenModel;
