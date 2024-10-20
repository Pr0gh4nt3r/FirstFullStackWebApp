import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import UserModel from '../models/user.model.js';

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findOne(req.body);
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserWithAddresses = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const userWithAddresses = await UserModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }  // Finde den Benutzer basierend auf der User-ID
            },
            {
                $lookup: { // Verknüpfe die Adressen basierend auf den ObjectId's in personalData.addresses
                    from: 'addresses', // Die Collection, aus der wir die Adressen beziehen
                    localField: 'personalData.addresses', // Das Feld in der User-Collection, das die Adressen-IDs enthält
                    foreignField: '_id', // Das Feld in der Address-Collection, das die ObjectId's speichert
                    as: 'personalData.addresses' // Wie das Ergebnis im Enddokument genannt wird
                }
            }
        ]);

        if (userWithAddresses.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(userWithAddresses[0]); // Da Aggregation immer ein Array zurückgibt, nimm das erste Element
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        const newUser = {
            ...req.body,
            password: hashedPassword
        }

        const user = await UserModel.create(newUser);

        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Use $set to update the fields without overwriting the entire document
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { $set: req.body }, // Use $set to add/update fields without deleting others
            { new: true, upsert: true } // new returns the updated document, upsert creates if not exists
        );

        if (!updatedUser)
            return res.status(404).json({ message: 'User not found!' });

        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const linkAddressToUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Die User-ID aus den Request-Parametern entnehmen
        const { addressId } = req.body; // Die Adresse, die hinzugefügt werden soll, wird aus dem Request-Body entnommen

        if (!mongoose.Types.ObjectId.isValid(addressId)) {
            return res.status(400).json({ message: 'Invalid address ID' });
        }

        // Verwende den $push Operator, um die ObjectId zum addresses Array hinzuzufügen
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { $push: { 'personalData.addresses': addressId } }, // Füge die addressId zum addresses-Array hinzu
            { new: true } // Gib das aktualisierte Dokument zurück
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found!' });
        }

        res.status(200).json(updatedUser); // Rückgabe des aktualisierten Benutzers
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const unlinkAddressToUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Die User-ID aus den Request-Parametern entnehmen
        const { addressId } = req.body; // Die Adresse, die entfernt werden soll, wird aus dem Request-Body entnommen

        if (!mongoose.Types.ObjectId.isValid(addressId)) {
            return res.status(400).json({ message: 'Invalid address ID' });
        }

        // Verwende den $pull Operator, um die ObjectId vom addresses Array zu entfernen
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { $pull: { 'personalData.addresses': addressId } }, // Entferne die addressId aus dem addresses-Array
            { new: true }  // Gib das aktualisierte Dokument zurück
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found!' });
        }

        res.status(200).json(updatedUser); // Rückgabe des aktualisierten Benutzers
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePersonalData = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Use $set to update the fields without overwriting the entire document
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { $unset: { personalData: null } }, // Use $set to add/update fields without deleting others
            { new: true, upsert: true } // new returns the updated document, upsert creates if not exists
        );

        if (!updatedUser)
            return res.status(404).json({ message: 'User not found!' });

        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const user = await UserModel.findByIdAndDelete(id);

        if (!user)
            return res.status(404).json({ message: 'User not found!' });

        res.status(200).json('User deleted successfully.');
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}