import dotenv from "dotenv";

import express, { json, urlencoded } from "express";
import * as mongoose from "mongoose";

import accountRouter from "./Routers/account.router.js";
import addressRouter from "./Routers/address.router.js";
import personalDataRouter from "./Routers/personalData.router.js";
import aggregationRouter from "./Routers/aggregation.router.js";
import { getMongoDbIP, getMongoDbPort } from "./Helpers/db.helper.js";
import phoneRouter from "./Routers/phone.router.js";

dotenv.config();

const port = 1338;
const app = express();

// middleware
app.use(json());
app.use(urlencoded({ extended: false }));

// routes
app.use(accountRouter);
app.use("/personaldata", personalDataRouter);
app.use("/phone", phoneRouter);
app.use("/address", addressRouter);
app.use("/aggregation", aggregationRouter);

mongoose
  .connect(`mongodb://${getMongoDbIP()}:${getMongoDbPort()}/test`)
  .then(() => {
    console.log("Database connection successfully established!");
    app.listen(port, () => {
      console.log(`Listening on port ${port}!`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed!", err);
  });
