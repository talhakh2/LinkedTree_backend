import express from 'express';
import { getAllOwnerAccounts, RegisterUser } from '../Controller/SubAccountController.js';

const subAccountRoutes = express.Router();

subAccountRoutes.route('/').post(RegisterUser)
subAccountRoutes.route('/:ownerId').get(getAllOwnerAccounts)
export default subAccountRoutes;