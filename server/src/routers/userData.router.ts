import express from 'express';

import { getUserData, createUserData, updateUserData, deleteUserData } from '../controllers/userData.controller.js'
import { authenticateToken } from '../controllers/jwt.controller.js';

const userDataRouter = express.Router();

userDataRouter.get('/', getUserData);
userDataRouter.post('/', createUserData);
userDataRouter.patch('/:id', authenticateToken, updateUserData);
userDataRouter.delete('/:id', authenticateToken, deleteUserData);

export default userDataRouter;