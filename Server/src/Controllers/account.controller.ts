import { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { jwtDecode } from "jwt-decode";

import AccountModel from "../Models/accounts.model.js";
import { IAccountDocument } from "../Interfaces/accounts.interface.js";

export const getAccount = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"]; // get the authorization header
  const token = authHeader && authHeader.split(" ")[1]; // get the token from the request header
  const decoded = jwtDecode<{ exp: number; id: string }>(token || ""); // decode the token
  const accountId = decoded.id;

  try {
    const account: IAccountDocument[] | null = await AccountModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(accountId), // match the account by id
        },
      },
      // include / exclude fields
      {
        $project: {
          _id: 1,
          role: 1,
          userName: 1,
          email: 1,
          password: 1,
          confirmed: 1,
          createdAt: 1,
        },
      },
    ]);
    res.status(200).json(account[0]); // return the account
  } catch (error: any) {
    res.status(500).json({ message: error.message || "User not found" });
  }
};

export const createAccount = async (req: Request, res: Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password with bcrypt

    // build the new account object with hashed password
    const newAccount = {
      ...req.body,
      password: hashedPassword,
    };

    const account = await AccountModel.create(newAccount); // Create the account in the database

    res.status(200).json(account); // Return the created account
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Account creation failed" });
  }
};

export const updateAccount = async (req: Request, res: Response) => {
  const { id } = req.params; // get account id from request params
  try {
    // Use $set to update the fields without overwriting the entire document
    const updatedAccount = await AccountModel.findByIdAndUpdate(
      id,
      { $set: req.body }, // Use $set to add/update fields without deleting others
      { new: true, upsert: true } // new returns the updated document, upsert creates if not exists
    );

    // Check if the account was found and updated
    if (!updatedAccount)
      return res.status(404).json({ message: "User not found!" });

    res.status(200).json(updatedAccount); // Return the updated user
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Update failed!" });
  }
};

export const addPersonalData = async (req: Request, res: Response) => {
  const { id } = req.params; // get user id from request params
  const { personalDataId } = req.body; // the personal data to be added is taken from the request body
  try {
    // Check if the personalDataId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(personalDataId)) {
      return res.status(400).json({ message: "Invalid personal data ID!" });
    }

    // Use $set to add the ObjectId to the personalData field
    const updatedAccount = await AccountModel.findByIdAndUpdate(
      id,
      { $set: { personalData: personalDataId } }, // Set the personalData field to the new ObjectId
      { new: true } // Return the updated document
    );

    // Check if the account was found and updated
    if (!updatedAccount) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(updatedAccount); // Return the updated account
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Update failed!" });
  }
};

export const removePersonalData = async (req: Request, res: Response) => {
  const { id } = req.params; // get user id from request params
  const { personalDataId } = req.body; // the personal data to be removed is taken from the request body
  try {
    // Check if the personalDataId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(personalDataId)) {
      return res.status(400).json({ message: "Invalid personal data ID!" });
    }

    // Use $unset to remove the ObjectId from the personalData field
    const updatedAccount = await AccountModel.findByIdAndUpdate(
      id,
      { $unset: { personalData: null } }, // Remove the personalData field
      { new: true } // Return the updated document
    );

    // Check if the account was found and updated
    if (!updatedAccount) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(updatedAccount); // Return the updated user
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Update failed!" });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  const { id } = req.params; // get user id from request params
  try {
    const account = await AccountModel.findByIdAndDelete(id); // Delete the account from the database

    if (!account) return res.status(404).json({ message: "User not found!" }); // Check if the account was found and deleted

    res.status(200).json("Account deleted successfully."); // Return success message
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Account deletion failed!" });
  }
};
