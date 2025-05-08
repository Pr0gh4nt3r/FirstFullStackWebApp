import express from "express";

import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  addPersonalData,
  removePersonalData,
} from "../Controllers/user.controller.js";
import { validateToken } from "../Controllers/jwt.controller.js";

const userRouter = express.Router(); // Create a new router instance

userRouter.get("/:id", validateToken, getUser);
userRouter.post("/signup", createUser);
userRouter.patch("/:id", validateToken, updateUser);
userRouter.patch("/:id/personaldata/add", validateToken, addPersonalData);
userRouter.patch("/:id/personaldata/remove", validateToken, removePersonalData);
userRouter.delete("/:id", validateToken, deleteUser);

export default userRouter;
