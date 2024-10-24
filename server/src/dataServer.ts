import dotenv from 'dotenv';

import express, { json, urlencoded } from 'express';
import * as mongoose from 'mongoose';

import userRouter from './routers/user.router.js'
import addressRouter from './routers/address.router.js';
import { getMongoDBURL, getMongoDBPort } from './helpers/databaseInfo.js';

dotenv.config();

const port = 1338;
const app = express();

// middleware
app.use(json());
app.use(urlencoded({ extended: false }));

// routes
app.use('/api/user', userRouter);
app.use('/api/address', addressRouter);

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