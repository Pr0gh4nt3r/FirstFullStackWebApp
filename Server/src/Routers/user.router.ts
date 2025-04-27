import express from "express";

import {
  getUser,
  getUserWithAddresses,
  createUser,
  updateUser,
  deleteUser,
  deletePersonalData,
  linkAddressToUser,
  unlinkAddressToUser,
} from "../Controllers/user.controller.js";
import { authenticateToken } from "../Controllers/jwt.controller.js";

const userRouter = express.Router();

userRouter.get("/", getUser);
userRouter.post("/", createUser);
userRouter.get("/:id", authenticateToken, getUserWithAddresses);
userRouter.patch("/:id", authenticateToken, updateUser);
userRouter.patch("/:id/address/link", authenticateToken, linkAddressToUser);
userRouter.patch("/:id/address/unlink", authenticateToken, unlinkAddressToUser);
userRouter.delete("/:id/personaldata", authenticateToken, deletePersonalData);
userRouter.delete("/:id", authenticateToken, deleteUser);

export default userRouter;
