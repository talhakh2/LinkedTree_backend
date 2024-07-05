import SubAccountsModel from "../Models/SubAccounts.js";
import Registration from '../Models/RegisterationModel.js';

export const RegisterUser = async (req, res) => {
    try {
        const user = await Registration.findById(req.body.ownerId);
        const body = {...req.body, subScriptionPlan: user.isTrial ? 'Trial' : user.paymentType};
        const data = await SubAccountsModel.create(body);
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const getAllOwnerAccounts = async (req, res) => {
    try {
        const ownerId = req.params.ownerId;
        const data = await SubAccountsModel.find({ownerId});
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const deleteSubAccount = async (req, res) => {
    try {
        const { id } = req.params;
        await SubAccountsModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Sub-account deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateSubAccount = async (req, res) => {
    try {
        const { subId } = req.params;
        await SubAccountsModel.findByIdAndUpdate(subId, req.body.userData, { new: true });
        res.status(200).json({ message: 'Sub-account updated successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

