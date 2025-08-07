import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Model, Document, ObjectId } from "mongoose";

import AccountModel from "../Models/accounts.model.js";
import { IAccountDocument } from "../Interfaces/accounts.interface.js";
import { IRevokedBy } from "../Interfaces/revokedBy.interface.js";
import refreshTokenModel from "../Models/refreshTokens.model.js";
import tokenRevocationModel from "../Models/tokenRevocations.model.js";
import {
  getAccessTokenSecret,
  getRefreshTokenSecret,
} from "../Helpers/token.helper.ts.js";

dotenv.config();

const cookieSettings = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Tage
} as any;

/**
 * Authenticate a user by checking their email and password.
 * If successful, generates an access token and optionally a refresh token.
 * @param req - The request object containing user credentials.
 * @param res - The response object to send the result.
 */
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
        // create a new refresh token document
        const newRefreshTokenModel = new refreshTokenModel({
          token: refreshToken,
        });

        await createDocument<typeof tokenRevocationModel.prototype>(
          refreshTokenModel,
          newRefreshTokenModel
        );
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }

      res.cookie("refreshToken", refreshToken, cookieSettings); // Setze den Cookie mit dem Refresh-Token
    }

    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Middleware to validate the JWT token from the request headers.
 * If valid, attaches the account information to the request object.
 * @param req - The request object containing the JWT token.
 * @param res - The response object to send the result.
 * @param next - The next middleware function to call if validation is successful.
 */
export const validateAccessToken = async (req: any, res: any, next: any) => {
  const token: string = req.headers.authorization?.split(" ")[1]; // getting the access token from the headers

  if (!token) return res.status(401);

  const accessTokenSecret = getAccessTokenSecret(); // Holen des Secrets über die Hilfsfunktion

  jwt.verify(token, accessTokenSecret, (err: any, account: any) => {
    if (err) return res.status(403);
    req.account = account;
    next();
  });
};

/**
 * Refreshes the access token using the refresh token from cookies.
 * If the refresh token is valid, generates a new access token and rotates the refresh token.
 * @param req - The request object containing the refresh token.
 * @param res - The response object to send the new access token.
 */
export const refreshToken = async (req: any, res: any) => {
  const refreshToken = req.cookies.refreshToken; // getting the refresh token from the cookies

  if (!refreshToken) return res.sendStatus(401); // return unauthorized if there is no token

  if (!refreshTokenModel.findOne({ token: refreshToken }))
    return res.sendStatus(403); // return forbidden if the given token not exists

  const refreshTokenSecret = getRefreshTokenSecret(); // Holen des Secrets über die Hilfsfunktion

  jwt.verify(refreshToken, refreshTokenSecret, async (err: any, acc: any) => {
    if (err) return res.sendStatus(403);

    const account = acc as IAccountDocument; // cast the account to IAccountDocument

    try {
      // generate a new access token
      // account is the payload of the token, which contains the id of the user
      const accessToken = generateAccessToken({
        id: account.id,
      } as IAccountDocument);

      // rotate refresh token
      const newRefreshToken = generateRefreshToken({
        id: account.id,
      } as IAccountDocument);

      // create a new refresh token document
      const newRefreshTokenModel = new refreshTokenModel({
        token: newRefreshToken,
      });

      // validate and create the new refresh token document
      const newRefreshTokenId: string = (
        await createDocument<typeof refreshTokenModel.prototype>(
          refreshTokenModel,
          newRefreshTokenModel
        )
      )._id.toString();

      // revoke the old refresh token
      await revokeRefreshToken(
        refreshToken,
        {
          userId: account.id, // assuming the revokedBy is the user id
          role: account.role, // assuming the revokedBy contains the user role
          userName: account.userName, // assuming the revokedBy contains the user name
          service: "authentication", // service that revoked the token
          ip: req.ip, // the ip address of the maschine that revoked the token
          userAgent: req.headers["user-agent"], // the user agent of the maschine that revoked the token
          deviceId: req.headers["device-id"], // the device id of the maschine that revoked the token
        } as IRevokedBy,
        "Rotated for security reasons",
        newRefreshTokenId // replacedByTokenId is the new refresh token
      );

      res.cookie("refreshToken", newRefreshToken, cookieSettings); // Setze den Cookie mit dem Refresh-Token
      res.status(200).json({ accessToken: accessToken });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
};

/**
 * Logs out a user by revoking their refresh token and clearing the cookie.
 * @param req - The request object containing the refresh token and revocation details.
 * @param res - The response object to send the result.
 */
export const logoutUser = async (req: any, res: any) => {
  const refreshToken: string = req.cookies.refreshToken; // getting the refresh token from the cookies
  const account: IAccountDocument = req.account; // getting the account from the request object

  if (!refreshToken && account) {
    // If there is no refresh token but an account, return 204 (No Content)
    return res.sendStatus(204);
  }

  if (!refreshToken) return res.sendStatus(401);

  if (!refreshTokenModel.findOne({ token: refreshToken }))
    return res.sendStatus(403); // return forbidden if the given token not exists

  const refreshTokenSecret = getRefreshTokenSecret(); // Holen des Secrets über die Hilfsfunktion

  jwt.verify(refreshToken, refreshTokenSecret, async (err: any, acc: any) => {
    if (err) return res.sendStatus(403);

    const account = acc as IAccountDocument; // cast the account to IAccountDocument

    const revokedBy: IRevokedBy = {
      userId: account.id, // assuming the revokedBy is the user id
      role: account.role, // assuming the revokedBy contains the user role
      userName: account.userName, // assuming the revokedBy contains the user name
      service: "authentication", // service that revoked the token
      ip: req.ip, // the ip address of the maschine that revoked the token
      userAgent: req.headers["user-agent"], // the user agent of the maschine that revoked the token
      deviceId: req.headers["device-id"], // the device id of the maschine that revoked the token
    } as IRevokedBy;

    const revokeReason: string = req.body?.revokeReason || "User logged out"; // reason for revocation, default is "User logged out"

    try {
      // Revoke the refresh token
      await revokeRefreshToken(refreshToken, revokedBy, revokeReason);

      // delete "refreshToken" from cookies (name needs to match exactly)
      res.clearCookie("refreshToken", cookieSettings); // Clear the cookie
      res.sendStatus(204);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
};

/**
 * Creates a token revocation document in the database.
 * @param tokenId - The ID of the token being revoked.
 * @param revokedBy - The information about who is revoking the token.
 * @param revokeReason - The reason for revoking the token.
 * @param replacedByTokenId - Optional ID of the token that replaces the revoked token.
 * @returns The created token revocation document.
 * @throws Error if there is an error during document creation or validation.
 */
async function createTokenRevocation(
  tokenId: ObjectId,
  revokedBy: IRevokedBy,
  revokeReason: string,
  replacedByTokenId?: ObjectId
) {
  const tokenRevocation = new tokenRevocationModel({
    tokenId: tokenId, // Store the ID of the token being revoked
    revokedAt: new Date(), // Set the current date and time as the revocation time
    revokedBy: revokedBy, // Store the revoker information
    revokeReason: revokeReason, // Store the reason for revocation
    replacedByTokenId: replacedByTokenId, // Optional field for the ID of the token that replaces the revoked token
  });

  return await createDocument<typeof tokenRevocationModel.prototype>(
    tokenRevocationModel,
    tokenRevocation
  ); // Validate and create the token revocation document
}

/**
 * Revoke a refresh token by marking it as revoked and creating a token revocation document.
 * @param refreshToken - The refresh token to be revoked.
 * @param revokedBy - The information about who is revoking the token.
 * @param revokeReason - The reason for revoking the token.
 * @param replacedByTokenId - Optional ID of the token that replaces the revoked token.
 * @returns The updated refresh token document.
 * @throws Error if the token is not found or if there is an error during revocation.
 */
async function revokeRefreshToken(
  refreshToken: string,
  revokedBy: IRevokedBy,
  revokeReason: string,
  replacedByTokenId?: string
) {
  const token = await refreshTokenModel.findOne({ token: refreshToken });

  if (!token) throw new Error("Token not found");

  try {
    // Save the token revocation document and get its ID
    const tokenRevocationRes = await createTokenRevocation(
      token._id.toString("hex") as unknown as ObjectId, // Convert the token ID to ObjectId
      revokedBy,
      revokeReason,
      (replacedByTokenId as unknown as ObjectId) ?? undefined // Convert replacedByTokenId to ObjectId if provided
    );

    token.revoked = true; // Setze das Feld revoked auf true
    token.revocationId = tokenRevocationRes._id.toString(); // Setze die ID des Widerrufs

    await token.save(); // Speichere die Änderungen
  } catch (error: any) {
    throw new Error(`Error revoking token: ${error.message}`);
  }

  return token;
}

/**
 * Creates a document in the database after validating it.
 * @param documentType - The Mongoose model type for the document.
 * @param doc - The document to be created.
 * @returns The created document.
 * @throws Error if there is an error during document creation or validation.
 */
async function createDocument<T extends Document>(
  documentModel: Model<T>,
  doc: T
): Promise<T> {
  // Validate the document before saving
  await validateDocument<T>(doc);

  let creatingResult: T;

  try {
    creatingResult = await documentModel.create(doc);
  } catch (error: any) {
    throw new Error(`Error creating document: ${error.message}`);
  }

  return creatingResult;
}

/**
 * Validates a Mongoose document before saving it to the database.
 * @param doc - The document to be validated.
 * @returns A promise that resolves if validation is successful, or rejects with an error if validation fails.
 * @throws Error if the document validation fails.
 */
async function validateDocument<T extends Document>(doc: T): Promise<T> {
  try {
    await doc.validate();
    return doc;
  } catch (error: any) {
    throw new Error(`Document validation error: ${error.message}`);
  }
}

/**
 * Generates an access token and a refresh token for the given account.
 * @param account - The account document for which the tokens are generated.
 * @returns An object containing the access token and refresh token.
 */
function generateAccessToken(account: IAccountDocument) {
  const accessTokenSecret = getAccessTokenSecret(); // Holen des Secrets über die Hilfsfunktion
  return jwt.sign(account, accessTokenSecret, { expiresIn: "60m" });
}

/**
 * Generates a refresh token for the given account.
 * @param account - The account document for which the refresh token is generated.
 * @returns The generated refresh token.
 */
function generateRefreshToken(account: IAccountDocument) {
  const refreshTokenSecret = getRefreshTokenSecret(); // Holen des Secrets über die Hilfsfunktion
  return jwt.sign(account, refreshTokenSecret, { expiresIn: "30d" });
}
