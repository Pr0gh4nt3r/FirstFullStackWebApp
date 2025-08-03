import express from "express";

import {
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  addPersonalData,
  removePersonalData,
} from "../Controllers/account.controller.js";
import { validateToken } from "../Controllers/jwt.controller.js";

const userRouter = express.Router(); // Create a new router instance

userRouter.get("/account", validateToken, getAccount);
userRouter.post("/signup", createAccount);
userRouter.patch("/account/:id", validateToken, updateAccount);
userRouter.patch(
  "/account/:id/personaldata/add",
  validateToken,
  addPersonalData
);
userRouter.patch(
  "/account/:id/personaldata/remove",
  validateToken,
  removePersonalData
);
userRouter.delete("/account/:id", validateToken, deleteAccount);

export default userRouter;
