import { Request, Response } from "express";

import AddressModel from "../Models/address.model.js";

export const getAddress = async (req: Request, res: Response) => {
  const { id } = req.params; // get user id from request params
  try {
    const address = await AddressModel.findById(id); // Find the address by ID
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
  try {
    const updatedAddress = await AddressModel.findByIdAndUpdate(
      id,
      req.body,
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
