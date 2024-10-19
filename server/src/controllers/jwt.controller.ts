import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/user.model.js';
import tokenModel from '../models/token.model.js';
import { getAccessTokenSecret } from '../helpers/tokenSecret.js';

dotenv.config();

export const authenticateUser = async (req: any, res: any) => {
    try {
        // find user by email
        const userData = await UserModel.findOne({ email: req.body.email });

        if (userData === null || userData === undefined)
            return res.status(400).send('User not found');

        // authenticate user
        if (await bcrypt.compare(req.body.password, userData.password)) {
            const user = { email: userData.email };
    
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
    
            // save refresh token
            try {
                await tokenModel.create({ refreshToken: refreshToken });
            } catch (error: any) {
                res.status(500).json({ message: error.message });
            }
    
            res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
        }
        else {
            res.status(403).send('Wrong password');
        }

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const authenticateToken = async (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token === undefined || token === null) return res.status(401);

    const accessTokenSecret = getAccessTokenSecret();  // Holen des Secrets über die Hilfsfunktion

    jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
        if (err) return res.status(403);
        req.user = user;
        next();
    });
}

export const refreshToken = async (req: any, res: any ) => {
    const refreshToken = req.body.token;

    if (refreshToken === null || refreshToken === undefined) return res.sendStatus(401); // return unauthorized if there is no token
    if (!tokenModel.findOne({ refreshToken: refreshToken })) return res.sendStatus(403); // return forbidden if the given token not exists

    const accessTokenSecret = getAccessTokenSecret();  // Holen des Secrets über die Hilfsfunktion

    jwt.verify(refreshToken, accessTokenSecret, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ email: user.email });
        res.json({ accessToken: accessToken });
    });
}

export const deleteRefreshToken = async (req: any, res: any) => {
    // delete active refreshtoken
    try {
        const token = await tokenModel.findOneAndDelete({ refreshToken: req.body.token });
        res.sendStatus(204)
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

function generateAccessToken(user: any) {
    const accessTokenSecret = getAccessTokenSecret();  // Holen des Secrets über die Hilfsfunktion
    return jwt.sign(user, accessTokenSecret, { expiresIn: '30m' });
}

function generateRefreshToken(user: any) {
    const accessTokenSecret = getAccessTokenSecret();  // Holen des Secrets über die Hilfsfunktion
    return jwt.sign(user, accessTokenSecret, { expiresIn: '30d' });
}