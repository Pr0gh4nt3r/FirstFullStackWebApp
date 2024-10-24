import dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';
import mongoose from 'mongoose';

import jwtRouter from './routers/jwt.router.js';
import { getMongoDBURL, getMongoDBPort } from './helpers/databaseInfo.js';

dotenv.config();

const port = 1337;
const app = express();

// middleware
app.use(json());
app.use(urlencoded({ extended: false }));

// routes
app.use('/api', jwtRouter);

mongoose.connect(`mongodb://${getMongoDBURL()}:${getMongoDBPort()}/test`)
.then(() => {
    console.log('Database connection successfully established!');
    app.listen(port, () => {
        console.log(`Listening on port ${port}!`);
    });
})
.catch((err) => {
    console.error('Database connection failed!', err);
});