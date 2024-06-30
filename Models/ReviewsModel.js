import mongoose from 'mongoose';

const ReviewsSchema = new mongoose.Schema(
    {
        pageId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
        },
        reviewDate: {
            type: Date,
            default: () => new Date(),
        },
        reviewTime: {
            type: String,
            default: () => new Date().toLocaleTimeString('en-US', { hour12: false }),
        },
        text: {
            type: String,
            default: ''
        },
    },
    {
        timestamps: true,
    }
);

const ReviewModel = mongoose.model('Reviews', ReviewsSchema);

export default ReviewModel;
