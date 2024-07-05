import express from 'express';
import { getAllOwnerAccounts, RegisterUser, deleteSubAccount, updateSubAccount} from '../Controller/SubAccountController.js';

const subAccountRoutes = express.Router();

subAccountRoutes.route('/').post(RegisterUser)
subAccountRoutes.route('/:ownerId').get(getAllOwnerAccounts)
subAccountRoutes.route('/delete/:id').delete(deleteSubAccount);
subAccountRoutes.route('/update/:subId').put(updateSubAccount);

export default subAccountRoutes;