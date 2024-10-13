import bcrypt from 'bcrypt';

import { UserDataModel } from '../models/userData.model.js';

export const getUserData = async (req: any, res: any) => {
    try {
        const userData = await UserDataModel.findOne(req.body);
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createUserData = async (req: any, res: any) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUserData = {
            ...req.body,
            password: hashedPassword
        }
        const userData = await UserDataModel.create(newUserData);
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateUserData = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const userData = await UserDataModel.findByIdAndUpdate(id, req.body);
        if (!userData)
            return res.status(404).json({ message: 'User Data not found!' });
        const updatedUserData = await UserDataModel.findById(id);
        res.status(200).json(updatedUserData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteUserData = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const userData = await UserDataModel.findByIdAndDelete(id);
        if (!userData)
            return res.status(404).json({ message: 'User Data not found!' });
        res.status(200).json('User Data deleted successfully.');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}