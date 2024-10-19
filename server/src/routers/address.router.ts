import express from 'express';

import { getAddress, createAddress, updateAddress, deleteAddress, createAddressAndLinkToUser } from '../controllers/address.controller.js';
import { authenticateToken } from '../controllers/jwt.controller.js';

const addressRouter = express.Router();

addressRouter.get('/', authenticateToken, getAddress);
addressRouter.post('/', authenticateToken, createAddress);
addressRouter.post('/:id', authenticateToken, createAddressAndLinkToUser);
addressRouter.patch('/:id', authenticateToken, updateAddress);
addressRouter.delete('/:id', authenticateToken, deleteAddress);

export default addressRouter;