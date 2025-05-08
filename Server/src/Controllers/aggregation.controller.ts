import { Request, Response } from "express";
import mongoose from "mongoose";

import UserModel from "../Models/user.model.js";
import { IUserDocument } from "../Interfaces/user.interface.js";

export const getUserWithPersonalData = async (req: Request, res: Response) => {
  const { id } = req.params; // get user id from request params
  try {
    const userWithPersonalData: IUserDocument[] | null =
      await UserModel.aggregate([
        // 1) Finde den User
        {
          $match: { _id: new mongoose.Types.ObjectId(id) }, // Finde den Benutzer basierend auf der User-ID
        },
        // 2) Hol personalData
        {
          $lookup: {
            // Verknüpfe die Adressen basierend auf den ObjectId's in personalData.addresses
            from: "personalData", // Die Collection, aus der wir die Adressen beziehen
            localField: "personalData", // Das Feld in der User-Collection, das die Adressen-IDs enthält
            foreignField: "_id", // Das Feld in der Address-Collection, das die ObjectId's speichert
            as: "personalData", // Wie das Ergebnis im Enddokument genannt wird
          },
        },
        { $unwind: "$personalData" }, // Entpacke das Array, um ein einzelnes Dokument zu erhalten
        // 3) Unwind phones‑Array, damit wir jede Nummer einzeln lookuppen
        {
          $unwind: {
            path: "$personalData.phones",
            preserveNullAndEmptyArrays: true,
          },
        },
        // 4) Lookup des Typs zu jeder Nummer
        {
          $lookup: {
            from: "numberTypes",
            localField: "personalData.phones.type",
            foreignField: "_id",
            as: "personalData.phones.typeInfo",
          },
        },
        // 5) Flatten des Typ‑Arrays (genauer: wir erwarten einen Eintrag)
        {
          $addFields: {
            "personalData.phones.typeInfo": {
              $arrayElemAt: ["$personalData.phones.typeInfo", 0],
            },
          },
        },
        // 6) Bilde neues Feld phonesObj mit Nummer und Typ‑Beschreibung
        {
          $addFields: {
            "personalData.phones": {
              type: "$personalData.phones.typeInfo.description",
              number: "$personalData.phones.number",
            },
          },
        },
        // 7) Regruppiere alle phones zu einem Array
        {
          $group: {
            _id: "$_id",
            userName: { $first: "$userName" },
            email: { $first: "$email" },
            password: { $first: "$password" },
            confirmed: { $first: "$confirmed" },
            personalData: { $first: "$personalData" },
            phones: { $push: "$personalData.phones" }, // Alle Nummern in ein Array packen
          },
        },
        // 8) Schreibe phones‑Array zurück in personalData
        {
          $addFields: {
            "personalData.phones": "$phones", // Ersetze das Array mit den neuen Nummern
          },
        },
        // 9) Säubere Hilfsfelder
        {
          $project: {
            phones: 0,
            "personalData._id": 0,
            "personalData.phones.typeInfo": 0,
            "personalData.addresses": 0,
          },
        },
      ]); // Typisiere das Ergebnis als Array von IUserDocument
    if (userWithPersonalData.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(userWithPersonalData[0]); // Da Aggregation immer ein Array zurückgibt, nimm das erste Element
  } catch (error: any) {
    res.status(500).json({ message: error.message || "User not found" });
  }
};

export const getUserWithAddresses = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userWithAddresses: IUserDocument[] | null = await UserModel.aggregate(
      [
        // 1) Benutzer finden
        {
          $match: { _id: new mongoose.Types.ObjectId(id) }, // Finde den Benutzer basierend auf der User-ID
        },
        // 2) personalData einbinden (einfacher Lookup, kein Unwind)
        {
          $lookup: {
            from: "personalData",
            localField: "personalData",
            foreignField: "_id",
            as: "personalData",
          },
        },
        // Da wir aber personalData nur einmal erwarten, packen wir es als Objekt
        {
          $addFields: { personalData: { $arrayElemAt: ["$personalData", 0] } },
        },
        // 3) Phones auflösen (wie gehabt)
        {
          $unwind: {
            path: "$personalData.phones",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "numberTypes",
            localField: "personalData.phones.type",
            foreignField: "_id",
            as: "personalData.phones.typeInfo",
          },
        },
        {
          $addFields: {
            "personalData.phones.type": {
              $arrayElemAt: ["$personalData.phones.typeInfo.description", 0],
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            // Felder vor personalData behalten
            userName: { $first: "$userName" },
            email: { $first: "$email" },
            password: { $first: "$password" },
            confirmed: { $first: "$confirmed" },
            // personalData bis hierher einmal nehmen
            personalData: { $first: "$personalData" },
            // alle phones sammeln
            phones: { $push: "$personalData.phones" },
          },
        },
        { $addFields: { "personalData.phones": "$phones" } },
        // 4) Addresses auflösen und type ersetzen
        {
          $unwind: {
            path: "$personalData.addresses",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "addresses",
            localField: "personalData.addresses",
            foreignField: "_id",
            as: "addressObj",
          },
        },
        {
          $addFields: {
            personalData: {
              $mergeObjects: [
                "$personalData",
                { addresses: { $arrayElemAt: ["$addressObj", 0] } },
              ],
            },
          },
        },
        // 5) Typ auflösen für jede Adresse
        {
          $lookup: {
            from: "addressTypes",
            localField: "personalData.addresses.type",
            foreignField: "_id",
            as: "typeInfo",
          },
        },
        {
          $addFields: {
            "personalData.addresses.type": {
              $arrayElemAt: ["$typeInfo.description", 0],
            },
          },
        },
        // 6) Addresses wieder zum Array gruppieren
        {
          $group: {
            _id: "$_id",
            userName: { $first: "$userName" },
            email: { $first: "$email" },
            password: { $first: "$password" },
            confirmed: { $first: "$confirmed" },
            personalData: { $first: "$personalData" },
            addresses: { $push: "$personalData.addresses" },
          },
        },
        { $addFields: { "personalData.addresses": "$addresses" } },
        // 7) Säubere Hilfsfelder
        {
          $project: {
            phones: 0,
            typeInfo: 0,
            addressObj: 0,
            addresses: 0,
            "personalData._id": 0,
            "personalData.phones.typeInfo": 0,
            "personalData.addresses._id": 0,
            "personalData.addresses.createdAt": 0,
            "personalData.addresses.updatedAt": 0,
            "personalData.addresses.__v": 0,
          },
        },
      ]
    );

    if (userWithAddresses.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userWithAddresses[0]); // Da Aggregation immer ein Array zurückgibt, nimm das erste Element
  } catch (error: any) {
    res.status(500).json({ message: error.message || "User not found" });
  }
};
