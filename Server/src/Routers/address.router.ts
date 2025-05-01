import express from "express";

import {
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  createAddressAndLinkToUser,
} from "../Controllers/address.controller.js";
import { validateToken } from "../Controllers/jwt.controller.js";

const addressRouter = express.Router();

addressRouter.get("/", validateToken, getAddress);
addressRouter.post("/", validateToken, createAddress);
addressRouter.post("/:id", validateToken, createAddressAndLinkToUser);
addressRouter.patch("/:id", validateToken, updateAddress);
addressRouter.delete("/:id", validateToken, deleteAddress);

export default addressRouter;
