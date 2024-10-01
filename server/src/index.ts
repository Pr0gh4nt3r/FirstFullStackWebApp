import express, { json } from "express";

const port = 1337;
const app = express();

app.use(json());

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});