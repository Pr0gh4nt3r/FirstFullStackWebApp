import express from "express";

import {
  getUserWithFullPersonalData,
  getUserWithPersonalDataAndPhones,
} from "../Controllers/aggregation.controller.js";
import { validateAccessToken } from "../Controllers/jwt.controller.js";

const aggregationRouter = express.Router(); // Create a new router instance

aggregationRouter.get(
  "/account/:id/personal/phones",
  validateAccessToken,
  getUserWithPersonalDataAndPhones
);
aggregationRouter.get(
  "/account/:id/personal/full",
  validateAccessToken,
  getUserWithFullPersonalData
);

export default aggregationRouter;
