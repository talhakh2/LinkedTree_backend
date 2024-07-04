
import mongoose from 'mongoose';

const SpinSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        hasSpun: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const Spin = mongoose.model('Spin', SpinSchema);

export default Spin;
