import express from "express";

import {
  createPhone,
  deletePhone,
  getPhone,
  updatePhone,
} from "../Controllers/phone.controller.js";
import { validateToken } from "../Controllers/jwt.controller.js";

const phoneRouter = express.Router(); // Create a new router instance

phoneRouter.get("/:id", validateToken, getPhone);
phoneRouter.post("/", validateToken, createPhone);
phoneRouter.patch("/:id", validateToken, updatePhone);
phoneRouter.delete("/:id", validateToken, deletePhone);

export default phoneRouter;
