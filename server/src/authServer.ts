import express, { json, urlencoded } from 'express';
import mongoose from 'mongoose';

import jwtRouter from './routers/jwt.router.js';

const port = 1337;
const app = express();

// middleware
app.use(json());
app.use(urlencoded({ extended: false }));

// routes
app.use('/api', jwtRouter);

mongoose.connect('mongodb://172.24.48.1:27017/test')
.then(() => {
    console.log('Database connection successfully established!');
    app.listen(port, () => {
        console.log(`Listening on port ${port}!`);
    });
})
.catch((err) => {
    console.error('Database connection failed!', err);
});