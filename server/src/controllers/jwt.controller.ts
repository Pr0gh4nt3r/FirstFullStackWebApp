import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { UserDataModel } from '../models/userData.model.js';

dotenv.config();

// not for productional environment -> use DB instead
let refreshTokens = [];

export const authenticateUser = async (req: any, res: any) => {
    // ToDo authenticate User
    try {        
        const userData = await UserDataModel.findOne({ email: req.body.email });

        if (userData === null || userData === undefined)
            return res.status(400).send('User not found');

        if (await bcrypt.compare(req.body.password, userData.password)) {
            const user = { email: userData.email };
    
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
    
            // save refresh token -> use DB for prod environment
            refreshTokens.push(refreshToken);
    
            res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
        }
        else {
            res.status(403).send('Wrong password');
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const authenticateToken = async (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token === undefined || token === null) return res.status(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
        if (err) return res.status(403);
        req.user = user;
        next();
    });
}

export const refreshToken = async (req: any, res: any ) => {
    const refreshToken = req.body.token;

    if (refreshToken === null || refreshToken === undefined) return res.sendStatus(401); // return unauthorized if there is no token
    // for prod check the DB instead
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403); // return forbidden if the given token not exists
    
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ email: user.email });
        res.json({ accessToken: accessToken });
    });
}

export const deleteRefreshToken = async (req: any, res: any) => {
    // for prod set it to the DB
    refreshTokens = refreshTokens.filter(token => token !== req.body.token); // delete active refreshtoken
    res.sendStatus(204);
}

function generateAccessToken(user: any) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
}

function generateRefreshToken(user: any) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}