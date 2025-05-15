import express from "express";

import {
  getUserWithAddresses,
  getUserWithPersonalData,
} from "../Controllers/aggregation.controller.js";
import { validateToken } from "../Controllers/jwt.controller.js";

const aggregationRouter = express.Router(); // Create a new router instance

aggregationRouter.get(
  "/account/:id/personal",
  validateToken,
  getUserWithPersonalData
);
aggregationRouter.get(
  "/account/:id/address",
  validateToken,
  getUserWithAddresses
);

export default aggregationRouter;
