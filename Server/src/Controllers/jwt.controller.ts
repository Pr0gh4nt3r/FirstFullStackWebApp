import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import AccountModel from "../Models/account.model.js";
import { IAccountDocument } from "../Interfaces/account.interface.js";
import tokenModel from "../Models/token.model.js";
import {
  getAccessTokenSecret,
  getRefreshTokenSecret,
} from "../Helpers/token.helper.ts.js";

dotenv.config();

export const authenticateUser = async (req: any, res: any) => {
  try {
    // find account by email
    const account: IAccountDocument | null = await AccountModel.findOne({
      email: req.body.form.email,
    });

    if (!account) return res.status(400).send({ message: "User not found" });

    // authenticate user
    if (!(await bcrypt.compare(req.body.form.password, account.password)))
      return res.status(403).send({ message: "Wrong password" });

    // set payload an create tokens
    const payload = { id: account.id } as IAccountDocument;
    const accessToken = generateAccessToken(payload);

    let response = {
      accessToken: accessToken,
      account: { id: account._id },
    };

    if (req.body.rememberMe) {
      const refreshToken = generateRefreshToken(payload);

      // save refresh token
      try {
        await tokenModel.create({ refreshToken: refreshToken });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Tage
      } as any); // Setze den Cookie mit dem Refresh-Token
    }

    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const validateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401);

  const accessTokenSecret = getAccessTokenSecret(); // Holen des Secrets über die Hilfsfunktion

  jwt.verify(token, accessTokenSecret, (err: any, account: any) => {
    if (err) return res.status(403);
    req.account = account;
    next();
  });
};

export const refreshToken = async (req: any, res: any) => {
  const refreshToken = req.cookies.refreshToken; // getting the refresh token from the cookies

  if (!refreshToken) return res.sendStatus(401); // return unauthorized if there is no token

  if (!tokenModel.findOne({ refreshToken: refreshToken }))
    return res.sendStatus(403); // return forbidden if the given token not exists

  const refreshTokenSecret = getRefreshTokenSecret(); // Holen des Secrets über die Hilfsfunktion

  jwt.verify(refreshToken, refreshTokenSecret, (err: any, account: any) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({
      id: account.id,
    } as IAccountDocument);
    res.status(200).json({ accessToken: accessToken });
  });
};

export const deleteRefreshToken = async (req: any, res: any) => {
  // delete active refreshtoken
  try {
    await tokenModel.findOneAndDelete({
      refreshToken: req.cookies.refreshToken,
    });

    // delete "refreshToken" from cookies (name needs to match exactly)
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    } as any); // Clear the cookie

    res.sendStatus(204);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

function generateAccessToken(account: IAccountDocument) {
  const accessTokenSecret = getAccessTokenSecret(); // Holen des Secrets über die Hilfsfunktion
  return jwt.sign(account, accessTokenSecret, { expiresIn: "60m" });
}

function generateRefreshToken(account: IAccountDocument) {
  const refreshTokenSecret = getRefreshTokenSecret(); // Holen des Secrets über die Hilfsfunktion
  return jwt.sign(account, refreshTokenSecret, { expiresIn: "30d" });
}
