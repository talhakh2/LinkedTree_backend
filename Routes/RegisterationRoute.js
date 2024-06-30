import express from 'express';
import { getTrialUser, updateTrialUser, getUserData, login, RegisterUser, sendEmail, updateUserData, verifyUser, getAllUsers, getAllPages, getAdminDashboardData } from '../Controller/RegisterationController.js';

const RegisterationRoutes = express.Router();

RegisterationRoutes.route('/').get(login).post(RegisterUser)
RegisterationRoutes.route('/trial').get(getTrialUser).patch(updateTrialUser)
RegisterationRoutes.route('/getall').get(getAllUsers)
RegisterationRoutes.route('/dashboard').get(getAdminDashboardData)
RegisterationRoutes.route('/getall/pages').get(getAllPages)
RegisterationRoutes.route('/:id').get(getUserData).patch(updateUserData)
RegisterationRoutes.route('/verify/:id').patch(verifyUser)
RegisterationRoutes.route('/email').post(sendEmail)

export default RegisterationRoutes;