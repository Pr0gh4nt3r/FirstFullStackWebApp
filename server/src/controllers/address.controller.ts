import { Request, Response } from 'express';

import AddressModel from "../models/address.model.js";
import UserModel from '../models/user.model.js';

export const getAddress = async (req: Request, res: Response) => {
    try {
        const address = await AddressModel.find(req.body);
        res.status(200).json(address);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const createAddress = async (req: Request, res: Response) => {
    try {
        const address = await AddressModel.create(req.body);
        res.status(200).json(address);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const createAddressAndLinkToUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const newAddress = new AddressModel(req.body);
        await newAddress.save(); // Speichere die Adresse zuerst

        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { $push: { 'personalData.addresses': newAddress._id } },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const updateAddress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const address = await AddressModel.findByIdAndUpdate(id, req.body);

        if (!address)
            return res.status(404).json({ message: 'Address not found!' });

        const updatedAddress = await AddressModel.findById(id);

        res.status(200).json(updatedAddress);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const address = await AddressModel.findByIdAndDelete(id);
        
        if (!address)
            return res.status(404).json({ message: 'Address not found!' });

        const {userId} = req.body;
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $pull: { 'personalData.addresses': id } }, // Entferne die addressId aus dem addresses-Array
            { new: true }  // Gib das aktualisierte Dokument zurück
        );

        res.status(200).json(`Address deleted successfully.\n${updatedUser}`);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}