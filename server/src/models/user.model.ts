import mongoose, { Schema, Document, ObjectId, Types } from 'mongoose';

// PersonalData Interface für TypeScript
export interface PersonalData {
    firstName: string;
    secondName?: string;
    lastName: string;
    birthName?: string;
    birthday: Date;
    gender: 'male' | 'female' | 'other';
    phone?: string;
    addresses?: ObjectId[];
}
  
// Mongoose PersonalData Schema
const PersonalDataSchema = new Schema<PersonalData>({
    firstName: { type: String, required: true },
    secondName: { type: String, required: false },
    lastName: { type: String, required: true },
    birthName: { type: String, required: false },
    birthday: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    phone: { type: String, required: false },
    addresses: [{ type: Types.ObjectId, ref: 'addresses', required: false }] // Array von ObjectId-Referenzen
}, { _id: false });

// User Interface für TypeScript
export interface UserDocument extends Document {
    email: string;
    password: string;
    confirmed?: boolean;
    personalData?: PersonalData; // personalData ist jetzt optional
}

// Mongoose User Schema
const UserSchema = new Schema<UserDocument>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    personalData: { type: PersonalDataSchema, required: false } // Optionales Feld
},
{ 
    timestamps: true,
    collection: 'users'
}); // Fügt createdAt und updatedAt hinzu

// Modell exportieren
const UserModel = mongoose.model<UserDocument>('User', UserSchema);
export default UserModel;