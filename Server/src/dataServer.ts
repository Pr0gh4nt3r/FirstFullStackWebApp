import dotenv from "dotenv";

import express, { json, urlencoded } from "express";
import * as mongoose from "mongoose";

import userRouter from "./Routers/user.router.js";
import addressRouter from "./Routers/address.router.js";
import { getMongoDbIP, getMongoDbPort } from "./Helpers/db.helper.js";

dotenv.config();

const port = 1338;
const app = express();

// middleware
app.use(json());
app.use(urlencoded({ extended: false }));

// routes
app.use("/user", userRouter);
app.use("/address", addressRouter);

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
