import express, { json, urlencoded } from "express";
import * as mongoose from "mongoose";

import userDataRouter from "./routes/userData.route.js";

const port = 1337;
const app = express();

// middleware
app.use(json());
app.use(urlencoded({ extended: false }));

// routes
app.use("/api/userdata", userDataRouter);

mongoose.connect("mongodb://172.24.48.1:27017/test")
.then(() => {
    console.log("Database connection successfully established!");
    app.listen(port, () => {
        console.log(`Listening on port ${port}!`);
    });
})
.catch((err) => {
    console.error("Database connection failed!", err);
});