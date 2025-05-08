import express from "express";

import {
  authenticateUser,
  deleteRefreshToken,
  refreshToken,
  validateToken,
} from "../Controllers/jwt.controller.js";

const jwtRouter = express.Router(); // Create a new router instance

jwtRouter.post("/login", authenticateUser);
jwtRouter.post("/refresh", refreshToken);
jwtRouter.delete("/logout", validateToken, deleteRefreshToken);

export default jwtRouter;
