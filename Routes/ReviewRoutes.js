import express from 'express';
import { postReview, getReviews } from '../Controller/ReviewController.js';

const reviewRoutes = express.Router();

reviewRoutes.route('/').post(postReview)
reviewRoutes.route('/:id').get(getReviews)

export default reviewRoutes;