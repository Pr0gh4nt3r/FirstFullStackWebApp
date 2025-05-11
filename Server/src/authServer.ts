import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import jwtRouter from "./Routers/jwt.router.js";
import { getMongoDbIP, getMongoDbPort } from "./Helpers/db.helper.js";

dotenv.config();

const port = 1337;
const app = express();

// middleware
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use(jwtRouter);

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
