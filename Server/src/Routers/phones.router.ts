import express from "express";

import {
  createPhone,
  deletePhone,
  getPhone,
  updatePhone,
} from "../Controllers/phone.controller.js";
import { validateAccessToken } from "../Controllers/jwt.controller.js";

const phoneRouter = express.Router(); // Create a new router instance

phoneRouter.get("/:id", validateAccessToken, getPhone);
phoneRouter.post("/", validateAccessToken, createPhone);
phoneRouter.patch("/:id", validateAccessToken, updatePhone);
phoneRouter.delete("/:id", validateAccessToken, deletePhone);

export default phoneRouter;
