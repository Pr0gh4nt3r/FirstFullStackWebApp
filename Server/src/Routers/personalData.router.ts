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
import { validateAccessToken } from "../Controllers/jwt.controller.js";

const personalDataRouter = express.Router(); // Create a new router instance

personalDataRouter.get("/:id", validateAccessToken, getPersonalData);
personalDataRouter.post("/", validateAccessToken, createPersonalData);
personalDataRouter.patch("/:id", validateAccessToken, updatePersonalData);
personalDataRouter.patch("/:id/phones/add", validateAccessToken, addPhone);
personalDataRouter.patch(
  "/:id/phones/remove",
  validateAccessToken,
  removePhone
);
personalDataRouter.patch("/:id/addresses/add", validateAccessToken, addAddress);
personalDataRouter.patch(
  "/:id/addresses/remove",
  validateAccessToken,
  removeAddress
);
personalDataRouter.delete("/:id", validateAccessToken, deletePersonalData);

export default personalDataRouter;
