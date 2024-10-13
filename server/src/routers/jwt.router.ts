import express from 'express';

import { authenticateUser, refreshToken } from '../controllers/jwt.controller.js';

const jwtRouter = express.Router();

jwtRouter.post('/auth', authenticateUser);
jwtRouter.post('/reauth', refreshToken);

export default jwtRouter;