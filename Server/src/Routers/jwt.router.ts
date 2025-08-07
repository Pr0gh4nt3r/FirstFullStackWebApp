import express from "express";

import {
  authenticateUser,
  logoutUser,
  refreshToken,
  validateAccessToken,
} from "../Controllers/jwt.controller.js";

const jwtRouter = express.Router(); // Create a new router instance

jwtRouter.post("/login", authenticateUser);
jwtRouter.post("/refresh", refreshToken);
jwtRouter.patch("/logout", validateAccessToken, logoutUser);

export default jwtRouter;
