import express from "express";

import {
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../Controllers/address.controller.js";
import { validateAccessToken } from "../Controllers/jwt.controller.js";

const addressRouter = express.Router(); // Create a new router instance

addressRouter.get("/:id", validateAccessToken, getAddress);
addressRouter.post("/", validateAccessToken, createAddress);
addressRouter.patch("/:id", validateAccessToken, updateAddress);
addressRouter.delete("/:id", validateAccessToken, deleteAddress);

export default addressRouter;
