import express from 'express';

import { getUser, getUserWithAddresses, createUser, updateUser, deleteUser, deletePersonalData, linkAddressToUser } from '../controllers/user.controller.js'
import { authenticateToken } from '../controllers/jwt.controller.js';

const userRouter = express.Router();

userRouter.get('/', getUser);
userRouter.post('/', createUser);
userRouter.get('/:id', authenticateToken, getUserWithAddresses);
userRouter.patch('/:id', authenticateToken, updateUser);
userRouter.patch('/:id/address', authenticateToken, linkAddressToUser);
userRouter.delete('/:id/personaldata', authenticateToken, deletePersonalData);
userRouter.delete('/:id', authenticateToken, deleteUser);

export default userRouter;