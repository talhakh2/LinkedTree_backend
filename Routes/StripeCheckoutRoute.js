import express from 'express';
import { completePayment, monthlySessionCheckout, yearlySessionCheckout } from '../Controller/StripeController.js';

const StripeCheckout = express.Router();

StripeCheckout.route('/monthly').get(monthlySessionCheckout)
StripeCheckout.route('/yearly/').get(yearlySessionCheckout)
StripeCheckout.route('/success').get(completePayment)
// RegisterationRoutes.route('/verify/:id').patch(verifyUser)

export default StripeCheckout;