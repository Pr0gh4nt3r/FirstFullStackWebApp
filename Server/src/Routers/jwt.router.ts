import express from "express";

import {
  authenticateUser,
  deleteRefreshToken,
  refreshToken,
} from "../Controllers/jwt.controller.js";

const jwtRouter = express.Router();

jwtRouter.post("/login", authenticateUser);
jwtRouter.post("/reauth", refreshToken);
jwtRouter.delete("/logout", deleteRefreshToken);

export default jwtRouter;
