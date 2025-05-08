import { Request, Response } from "express";
import PersonalDataModel from "../Models/personalData.model.js";
import mongoose from "mongoose";

export const getPersonalData = async (req: Request, res: Response) => {
  const { id } = req.params; // get user id from request params
  try {
    const personalData = await PersonalDataModel.aggregate([
      // 1) Find the User
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }, // Find the user based on the User ID
      },
      // 2) filter the personalData
      {
        $project: {
          _id: 0,
          firstName: 1,
          middleNames: 1,
          lastName: 1,
          birthName: 1,
          birthday: 1,
          gender: 1,
          phones: 1,
          addresses: 1,
        },
      },
    ]);
    res.status(200).json(personalData[0]); // Return the personal data
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Personal data not found" });
  }
};

export const createPersonalData = async (req: Request, res: Response) => {
  try {
    const personalData = await PersonalDataModel.create(req.body); // Create a new personal data
    res.status(200).json(personalData); // Return the created personal data
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Personal data not found" });
  }
};

export const updatePersonalData = async (req: Request, res: Response) => {
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
    const updatedPersonalData = await PersonalDataModel.findByIdAndUpdate(
      id,
      { $set: update, $unset: unsetObj }, // Use $set to add/update fields and $unset to remove fields
      { new: true } // Return the updated document
    ); // Update the personal data by ID

    // Check if the personal data was found and updated
    if (!updatedPersonalData)
      return res.status(404).json({ message: "User not found!" });

    res.status(200).json(updatedPersonalData); // Return the updated personal data
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Personal data not found" });
  }
};

export const addPhone = async (req: Request, res: Response) => {
  const { id } = req.params; // get personal data id from request params
  const { phoneId } = req.body; // the phone to be added is taken from the request body
  try {
    // Check if the phoneId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(phoneId)) {
      return res.status(400).json({ message: "Invalid phone ID" });
    }

    // Use $push to add the ObjectId to the phones array
    const updatedPersonalData = await PersonalDataModel.findByIdAndUpdate(
      id,
      { $push: { phones: phoneId } }, // Add the phoneId to the phones array
      { new: true } // Return the updated document
    );

    // Check if the personal data was found and updated
    if (!updatedPersonalData) {
      return res.status(404).json({ message: "Personal data not found!" });
    }

    res.status(200).json(updatedPersonalData); // Return the updated personal data
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Personal data not found" });
  }
};

export const removePhone = async (req: Request, res: Response) => {
  const { id } = req.params; // get personal data id from request params
  const { phoneId } = req.body; // the phone to be removed is taken from the request body
  try {
    // Check if the phoneId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(phoneId)) {
      return res.status(400).json({ message: "Invalid phone ID" });
    }

    // Use $pull to remove the ObjectId from the phones array
    const updatedPersonalData = await PersonalDataModel.findByIdAndUpdate(
      id,
      { $pull: { phones: phoneId } }, // Remove the phoneId from the phones array
      { new: true } // Return the updated document
    );

    // Check if the personal data was found and updated
    if (!updatedPersonalData) {
      return res.status(404).json({ message: "Personal data not found!" });
    }

    res.status(200).json(updatedPersonalData); // Return the updated personal data
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Personal data not found" });
  }
};

export const addAddress = async (req: Request, res: Response) => {
  const { id } = req.params; // get personal data id from request params
  const { addressId } = req.body; // the address to be added is taken from the request body
  try {
    // Check if the addressId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: "Invalid address ID" });
    }

    // Use $push to add the ObjectId to the addresses array
    const updatedPersonalData = await PersonalDataModel.findByIdAndUpdate(
      id,
      { $push: { addresses: addressId } }, // Add the addressId to the addresses array
      { new: true } // Return the updated document
    );

    // Check if the personal data was found and updated
    if (!updatedPersonalData) {
      return res.status(404).json({ message: "Personal data not found!" });
    }

    res.status(200).json(updatedPersonalData); // Return the updated personal data
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Personal data not found" });
  }
};

export const removeAddress = async (req: Request, res: Response) => {
  const { id } = req.params; // get personal data id from request params
  const { addressId } = req.body; // the address to be removed is taken from the request body
  try {
    // Check if the addressId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: "Invalid address ID" });
    }

    // Use $pull to remove the ObjectId from the addresses array
    const updatedPersonalData = await PersonalDataModel.findByIdAndUpdate(
      id,
      { $pull: { addresses: addressId } }, // Remove the addressId from the addresses array
      { new: true } // Return the updated document
    );

    // Check if the personal data was found and updated
    if (!updatedPersonalData) {
      return res.status(404).json({ message: "Personal data not found!" });
    }

    res.status(200).json(updatedPersonalData); // Return the updated personal data
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Personal data not found" });
  }
};

export const deletePersonalData = async (req: Request, res: Response) => {
  const { id } = req.params; // get user id from request params
  try {
    const personalData = await PersonalDataModel.findByIdAndDelete(id); // Delete the personal data from the database

    // Check if the personal data was found and deleted
    if (!personalData)
      return res.status(404).json({ message: "User not found!" });

    res.status(200).json("Personal data successfully deleted."); // Return success message
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Personal data not found" });
  }
};
