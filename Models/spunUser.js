
import mongoose from 'mongoose';

// Spin Schema
const SpinSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        hasSpun: { type: Boolean, default: false },
        expiryDate: { type: Date, default: null }
    },
    {
        timestamps: true,
    }
);

const Spin = mongoose.model('Spin', SpinSchema);

export default Spin;
