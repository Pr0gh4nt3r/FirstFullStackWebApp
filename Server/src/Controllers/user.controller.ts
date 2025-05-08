import { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import UserModel from "../Models/user.model.js";
import { IUserDocument } from "../Interfaces/user.interface.js";

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params; // get user id from request params
  try {
    const user: IUserDocument[] | null = await UserModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }, // find user based on user id
      },
      // include / exclude fields
      {
        $project: {
          _id: 1,
          userName: 1,
          email: 1,
          password: 1,
          confirmed: 1,
        },
      },
    ]);
    res.status(200).json(user[0]); // return the user
  } catch (error: any) {
    res.status(500).json({ message: error.message || "User not found" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password with bcrypt

    // build the new user object with hashed password
    const newUser = {
      ...req.body,
      password: hashedPassword,
    };

    const user = await UserModel.create(newUser); // Create the user in the database

    res.status(200).json(user); // Return the created user
  } catch (error: any) {
    res.status(500).json({ message: error.message || "User creation failed" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params; // get user id from request params
  try {
    // Use $set to update the fields without overwriting the entire document
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: req.body }, // Use $set to add/update fields without deleting others
      { new: true, upsert: true } // new returns the updated document, upsert creates if not exists
    );

    // Check if the user was found and updated
    if (!updatedUser)
      return res.status(404).json({ message: "User not found!" });

    res.status(200).json(updatedUser); // Return the updated user
  } catch (error: any) {
    res.status(500).json({ message: error.message || "User update failed" });
  }
};

export const addPersonalData = async (req: Request, res: Response) => {
  const { id } = req.params; // get user id from request params
  const { personalDataId } = req.body; // the personal data to be added is taken from the request body
  try {
    // Check if the personalDataId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(personalDataId)) {
      return res.status(400).json({ message: "Invalid personal data ID" });
    }

    // Use $set to add the ObjectId to the personalData field
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: { personalData: personalDataId } }, // Set the personalData field to the new ObjectId
      { new: true } // Return the updated document
    );

    // Check if the user was found and updated
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(updatedUser); // Return the updated user
  } catch (error: any) {
    res.status(500).json({ message: error.message || "User not found" });
  }
};

export const removePersonalData = async (req: Request, res: Response) => {
  const { id } = req.params; // get user id from request params
  const { personalDataId } = req.body; // the personal data to be removed is taken from the request body
  try {
    // Check if the personalDataId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(personalDataId)) {
      return res.status(400).json({ message: "Invalid personal data ID" });
    }

    // Use $unset to remove the ObjectId from the personalData field
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $unset: { personalData: null } }, // Remove the personalData field
      { new: true } // Return the updated document
    );

    // Check if the user was found and updated
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(updatedUser); // Return the updated user
  } catch (error: any) {
    res.status(500).json({ message: error.message || "User not found" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params; // get user id from request params
  try {
    const user = await UserModel.findByIdAndDelete(id); // Delete the user from the database

    if (!user) return res.status(404).json({ message: "User not found!" }); // Check if the user was found and deleted

    res.status(200).json("User deleted successfully."); // Return success message
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
