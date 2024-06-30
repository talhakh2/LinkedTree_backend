import express from 'express';
import { getPaymentHistory, getSubscriptionCountsForPast10Dates } from '../Controller/PaymentHistoryController.js';

const paymentHistoryRoutes = express.Router();

paymentHistoryRoutes.route('/').get(getSubscriptionCountsForPast10Dates)
paymentHistoryRoutes.route('/:id').get(getPaymentHistory)

export default paymentHistoryRoutes;