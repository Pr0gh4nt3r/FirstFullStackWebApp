import express, { json } from "express";
import * as mongoose from "mongoose";

import { UserDataModel } from "./models/userData.models.js";

const port = 1337;
const app = express();

app.use(json());

app.post('/api/userdata', async (req, res) => {
    try {
        const userData = await UserDataModel.create(req.body);
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/userdata', async (req, res) => {
    try {
        const userData = await UserDataModel.find(req.body);
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

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