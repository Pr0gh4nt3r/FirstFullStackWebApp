import { Request, Response } from "express";
import PhonesDataModel from "../Models/phones.model.js";

export const getPhone = async (req: Request, res: Response) => {
  const { id } = req.params; // get phone id from request params
  try {
    const phone = await PhonesDataModel.findById(id); // Find the phone by ID
    res.status(200).json(phone); // Return the phone
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Phonenumber not found" });
  }
};

export const createPhone = async (req: Request, res: Response) => {
  try {
    const phone = await PhonesDataModel.create(req.body); // Create a new phone
    res.status(200).json(phone); // Return the created phone
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Phonenumber not found" });
  }
};

export const updatePhone = async (req: Request, res: Response) => {
  const { id } = req.params; // get phone id from request params
  try {
    const updatedPhone = await PhonesDataModel.findByIdAndUpdate(
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
    const phone = await PhonesDataModel.findByIdAndDelete(id); // Delete the phone from the database

    // Check if the phone was found and deleted
    if (!phone)
      return res.status(404).json({ message: "Phonenumber not found!" });

    res.status(200).json("Phonenumber successfully deleted."); // Return success message
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Phonenumber not found" });
  }
};
