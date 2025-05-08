import express from "express";

import {
  addAddress,
  addPhone,
  createPersonalData,
  deletePersonalData,
  getPersonalData,
  removeAddress,
  removePhone,
  updatePersonalData,
} from "../Controllers/personalData.controller.js";
import { validateToken } from "../Controllers/jwt.controller.js";

const personalDataRouter = express.Router(); // Create a new router instance

personalDataRouter.get("/:id", validateToken, getPersonalData);
personalDataRouter.post("/", validateToken, createPersonalData);
personalDataRouter.patch("/:id", validateToken, updatePersonalData);
personalDataRouter.patch("/:id/phones/add", validateToken, addPhone);
personalDataRouter.patch("/:id/phones/remove", validateToken, removePhone);
personalDataRouter.patch("/:id/addresses/add", validateToken, addAddress);
personalDataRouter.patch("/:id/addresses/remove", validateToken, removeAddress);
personalDataRouter.delete("/:id", validateToken, deletePersonalData);

export default personalDataRouter;
