import { Request, Response } from "express";
import mongoose from "mongoose";

import PhonesModel from "../Models/phones.model.js";

export const getPhone = async (req: Request, res: Response) => {
  const { id } = req.params; // get phone id from request params
  try {
    const phone = await PhonesModel.aggregate([
      // 1) Find the phone
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }, // Find the phone based on the phone ID
      },
      // 2) Lookup the type
      {
        $lookup: {
          from: "phoneTypes", // The collection from which we want to get the types
          localField: "type", // The field in the phone collection that contains the type ID
          foreignField: "_id", // The field in the phoneTypes collection that contains the ObjectId's
          as: "type", // How the result will be named in the final document
        },
      },
      // 3) Unwind the type array (we expect only one entry)
      {
        $unwind: { path: "$type", preserveNullAndEmptyArrays: true },
      },
      // 4) filter the phone
      {
        $project: {
          _id: 0,
          number: 1,
          "type.key": 1,
          "type.description": 1,
        },
      },
    ]);
    res.status(200).json(phone[0]); // Return the phone
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Phonenumber not found" });
  }
};

export const createPhone = async (req: Request, res: Response) => {
  try {
    const phone = await PhonesModel.create(req.body); // Create a new phone
    res.status(200).json(phone); // Return the created phone
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Phonenumber not found" });
  }
};

export const updatePhone = async (req: Request, res: Response) => {
  const { id } = req.params; // get phone id from request params
  try {
    const updatedPhone = await PhonesModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true } // Return the updated document
    ); // Update the phone by ID

    // Check if the phone was found and updated
    if (!updatedPhone)
      return res.status(404).json({ message: "Phonenumber not found!" });

    res.status(200).json(updatedPhone); // Return the updated phone
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Phonenumber not found" });
  }
};

export const deletePhone = async (req: Request, res: Response) => {
  const { id } = req.params; // get phone id from request params
  try {
    const phone = await PhonesModel.findByIdAndDelete(id); // Delete the phone from the database

    // Check if the phone was found and deleted
    if (!phone)
      return res.status(404).json({ message: "Phonenumber not found!" });

    res.status(200).json("Phonenumber successfully deleted."); // Return success message
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Phonenumber not found" });
  }
};
