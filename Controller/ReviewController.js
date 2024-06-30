import ReviewModel from "../Models/ReviewsModel.js";

export const getReviews = async (req, res) => {
    try {
        const data = await ReviewModel.find({ownerId: req.params.id});
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const postReview = async (req, res) => {
    try {
        const data = await ReviewModel.create(req.body);
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}