import express from "express";

import { getUserData, createUserData, updateUserData, deleteUserData } from "../controllers/userData.controller.js"

const userDataRouter = express.Router();

userDataRouter.get('/', getUserData);
userDataRouter.post('/', createUserData);
userDataRouter.patch('/:id', updateUserData);
userDataRouter.delete('/:id', deleteUserData);

export default userDataRouter;