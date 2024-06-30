import mongoose from 'mongoose';

const SubAccountsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        password: {
            type: String,
        },
        lastLogin: {
            type: Date,
            default: null
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        accountType: {
            type: String,
            default: 'sub'
        },
        status: {
            type: String,
            default: 'active'
        },
        subScriptionPlan: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

const SubAccountsModel = mongoose.model('SubAccounts', SubAccountsSchema);

export default SubAccountsModel;