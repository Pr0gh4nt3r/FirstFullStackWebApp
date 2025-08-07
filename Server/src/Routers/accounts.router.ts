import express from "express";

import {
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  addPersonalData,
  removePersonalData,
} from "../Controllers/account.controller.js";
import { validateAccessToken } from "../Controllers/jwt.controller.js";

const userRouter = express.Router(); // Create a new router instance

userRouter.get("/account", validateAccessToken, getAccount);
userRouter.post("/signup", createAccount);
userRouter.patch("/account/:id", validateAccessToken, updateAccount);
userRouter.patch(
  "/account/:id/personaldata/add",
  validateAccessToken,
  addPersonalData
);
userRouter.patch(
  "/account/:id/personaldata/remove",
  validateAccessToken,
  removePersonalData
);
userRouter.delete("/account/:id", validateAccessToken, deleteAccount);

export default userRouter;
