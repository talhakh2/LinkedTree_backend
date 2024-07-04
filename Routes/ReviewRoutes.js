import express from 'express';
import { postReview, getReviews, checkUserSpin } from '../Controller/ReviewController.js';

const reviewRoutes = express.Router();

reviewRoutes.route('/').post(postReview)
reviewRoutes.route('/:id').get(getReviews)
reviewRoutes.route('/check').post(checkUserSpin)

export default reviewRoutes;