import * as mongoose from 'mongoose';

// Interface für das Schema, um Typen in TypeScript zu definieren
interface Address {
    country: string;
    city: string;
    zipCode: string;
    street: string;
    number: string;
}
  
interface PersonalInformation {
    firstName: string;
    secondName?: string; // Optional
    lastName: string;
    birthName?: string;  // Optional
    birthday: Date;
    gender: 'male' | 'female' | 'other'; // Enum für Geschlecht
    phone?: string; // Optional
    address: Address;
}

interface UserData extends Document {
    email: string;
    password: string;
    confirmed: boolean;
    personalInformation: PersonalInformation;
}

// User Schema mit Timestamps
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    confirmed: { type: Boolean, default: false }, // Standardmäßig auf "false" gesetzt
    personalInformation: { 
        firstName: { type: String, required: true },
        secondName: { type: String }, // Optional
        lastName: { type: String, required: true },
        birthName: { type: String }, // Optional
        birthday: { type: Date, required: true },
        gender: { type: String, enum: ['male', 'female', 'other'], required: true },
        phone: { type: String }, // Optional
        address: { 
            country: { type: String, required: true },
            city: { type: String, required: true },
            zipCode: { type: String, required: true },
            street: { type: String, required: true },
            number: { type: String, required: true },
        },
    },
},
{ 
    timestamps: true,
    collection: 'userData'
}); // Fügt createdAt und updatedAt hinzu

// Modell exportieren
export const UserDataModel = mongoose.model('UserData', UserSchema);