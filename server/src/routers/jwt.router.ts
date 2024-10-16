import express from 'express';

import { authenticateUser, deleteRefreshToken, refreshToken } from '../controllers/jwt.controller.js';

const jwtRouter = express.Router();

jwtRouter.post('/auth', authenticateUser);
jwtRouter.post('/reauth', refreshToken);
jwtRouter.delete('/deauth', deleteRefreshToken);

export default jwtRouter;