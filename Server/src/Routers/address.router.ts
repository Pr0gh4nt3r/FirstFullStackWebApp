import express from "express";

import {
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../Controllers/address.controller.js";
import { validateToken } from "../Controllers/jwt.controller.js";

const addressRouter = express.Router(); // Create a new router instance

addressRouter.get("/:id", validateToken, getAddress);
addressRouter.post("/", validateToken, createAddress);
addressRouter.patch("/:id", validateToken, updateAddress);
addressRouter.delete("/:id", validateToken, deleteAddress);

export default addressRouter;
