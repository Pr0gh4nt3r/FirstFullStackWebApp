import { Request, Response } from "express";

import AddressModel from "../Models/address.model.js";
import mongoose from "mongoose";

export const getAddress = async (req: Request, res: Response) => {
  const { id } = req.params; // get user id from request params
  try {
    const address = await AddressModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }, // find address based on address id
      },
      // Lookup the type
      {
        $lookup: {
          from: "addressTypes", // The collection from which we want to get the types
          localField: "type", // The field in the address collection that contains the type ID
          foreignField: "_id", // The field in the addressTypes collection that contains the ObjectId's
          as: "type", // How the result will be named in the final document
        },
      },
      // Unwind the type array (we expect only one entry)
      {
        $unwind: { path: "$type", preserveNullAndEmptyArrays: true },
      },
      // include / exclude fields
      {
        $project: {
          _id: 0,
          street: 1,
          number: 1,
          city: 1,
          state: 1,
          country: 1,
          zipCode: 1,
          additionalInfo: 1,
          "type.key": 1,
          "type.description": 1,
        },
      },
    ]);
    res.status(200).json(address); // Return the address
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Address not found" });
  }
};

export const createAddress = async (req: Request, res: Response) => {
  try {
    const address = await AddressModel.create(req.body); // Create a new address
    res.status(200).json(address); // Return the created address
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Address not found" });
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  const { id } = req.params; // get user id from request params

  const { remove = [], update = {} } = req.body as {
    remove?: string[];
    update?: Record<string, any>;
  };

  const unsetObj = remove.reduce<Record<string, any>>((acc, key) => {
    acc[key] = ""; // Set the value to an empty string to indicate removal
    return acc;
  }, {});

  try {
    const updatedAddress = await AddressModel.findByIdAndUpdate(
      id,
      { $set: update, $unset: unsetObj }, // Use $set to add/update fields and $unset to remove fields
      { new: true } // Return the updated document
    ); // Update the address by ID

    // Check if the address was found and updated
    if (!updatedAddress)
      return res.status(404).json({ message: "Address not found!" });

    res.status(200).json(updatedAddress); // Return the updated address
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Address not found" });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  const { id } = req.params; // get user id from request params
  try {
    const address = await AddressModel.findByIdAndDelete(id); // Delete the address from the database

    // Check if the address was found and deleted
    if (!address)
      return res.status(404).json({ message: "Address not found!" });

    res.status(200).json("Address successfully deleted."); // Return success message
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Address not found" });
  }
};
