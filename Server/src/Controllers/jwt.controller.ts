import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../Models/user.model.js";
import { IUserDocument } from "../Interfaces/user.interface.js";
import tokenModel from "../Models/token.model.js";
import {
  getAccessTokenSecret,
  getRefreshTokenSecret,
} from "../Helpers/token.helper.ts.js";

dotenv.config();

export const authenticateUser = async (req: any, res: any) => {
  try {
    // find user by email
    const user: IUserDocument | null = await UserModel.findOne({
      email: req.body.form.email,
    });

    if (user === null || user === undefined)
      return res.status(400).send({ message: "User not found" });

    // authenticate user
    if (!(await bcrypt.compare(req.body.form.password, user.password)))
      return res.status(403).send({ message: "Wrong password" });

    // set payload an create tokens
    const payload = { id: user.id } as IUserDocument;
    const accessToken = generateAccessToken(payload);

    let response = {
      accessToken: accessToken,
      refreshToken: "",
      user: { id: user._id },
    };

    if (req.body.rememberMe) {
      const refreshToken = generateRefreshToken(payload);

      // save refresh token
      try {
        await tokenModel.create({ refreshToken: refreshToken });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }

      response = {
        ...response,
        refreshToken: refreshToken,
      };
    }

    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const validateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === undefined || token === null) return res.status(401);

  const accessTokenSecret = getAccessTokenSecret(); // Holen des Secrets über die Hilfsfunktion

  jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
    if (err) return res.status(403);
    req.user = user;
    next();
  });
};

export const refreshToken = async (req: any, res: any) => {
  const refreshToken = req.body.token;

  if (refreshToken === null || refreshToken === undefined)
    return res.sendStatus(401); // return unauthorized if there is no token
  if (!tokenModel.findOne({ refreshToken: refreshToken }))
    return res.sendStatus(403); // return forbidden if the given token not exists

  const refreshTokenSecret = getRefreshTokenSecret(); // Holen des Secrets über die Hilfsfunktion

  jwt.verify(refreshToken, refreshTokenSecret, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({
      id: user.id,
    } as IUserDocument);
    res.status(200).json({ accessToken: accessToken });
  });
};

export const deleteRefreshToken = async (req: any, res: any) => {
  // delete active refreshtoken
  try {
    await tokenModel.findOneAndDelete({
      refreshToken: req.body.refreshToken,
    });
    res.sendStatus(204);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

function generateAccessToken(user: IUserDocument) {
  const accessTokenSecret = getAccessTokenSecret(); // Holen des Secrets über die Hilfsfunktion
  return jwt.sign(user, accessTokenSecret, { expiresIn: "60m" });
}

function generateRefreshToken(user: IUserDocument) {
  const refreshTokenSecret = getRefreshTokenSecret(); // Holen des Secrets über die Hilfsfunktion
  return jwt.sign(user, refreshTokenSecret, { expiresIn: "30d" });
}
