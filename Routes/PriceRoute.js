import express from 'express';
import {getPrice, updateMonthlyPrice, updateYearlyPrice} from '../Controller/PriceController.js';


const PriceRoutes = express.Router();

PriceRoutes.route('/').get(getPrice)
PriceRoutes.route('/monthly').put(updateMonthlyPrice)
PriceRoutes.route('/yearly').put(updateYearlyPrice)


export default PriceRoutes;