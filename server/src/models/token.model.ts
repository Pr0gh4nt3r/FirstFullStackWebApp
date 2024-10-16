import * as mongoose from 'mongoose';

const refreshToken = new mongoose.Schema({
    refreshToken: { type: String, required: true }
},
{
    timestamps: true,
    collection: 'tokens'
}); // Fügt createdAt und updatedAt hinzu

// Modell exportieren
export const tokenModel = mongoose.model('Token', refreshToken);