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
  getUserWithPersonalData,
} from "../Controllers/user.controller.js";
import { validateToken } from "../Controllers/jwt.controller.js";

const userRouter = express.Router();

userRouter.get("/:id", validateToken, getUser);
userRouter.get("/:id/personal", validateToken, getUserWithPersonalData);
userRouter.get("/:id/address", validateToken, getUserWithAddresses);
userRouter.post("/signup", createUser);
userRouter.patch("/:id", validateToken, updateUser);
userRouter.patch("/:id/address/link", validateToken, linkAddressToUser);
userRouter.patch("/:id/address/unlink", validateToken, unlinkAddressToUser);
userRouter.delete("/:id/personaldata", validateToken, deletePersonalData);
userRouter.delete("/:id", validateToken, deleteUser);

export default userRouter;
