import express from "express";

import {
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  createAddressAndLinkToUser,
} from "../Controllers/address.controller.js";
import { authenticateToken } from "../Controllers/jwt.controller.js";

const addressRouter = express.Router();

addressRouter.get("/", authenticateToken, getAddress);
addressRouter.post("/", authenticateToken, createAddress);
addressRouter.post("/:id", authenticateToken, createAddressAndLinkToUser);
addressRouter.patch("/:id", authenticateToken, updateAddress);
addressRouter.delete("/:id", authenticateToken, deleteAddress);

export default addressRouter;
