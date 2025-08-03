import express from "express";

import {
  getUserWithFullPersonalData,
  getUserWithPersonalDataAndPhones,
} from "../Controllers/aggregation.controller.js";
import { validateToken } from "../Controllers/jwt.controller.js";

const aggregationRouter = express.Router(); // Create a new router instance

aggregationRouter.get(
  "/account/:id/personal/phones",
  validateToken,
  getUserWithPersonalDataAndPhones
);
aggregationRouter.get(
  "/account/:id/personal/full",
  validateToken,
  getUserWithFullPersonalData
);

export default aggregationRouter;
