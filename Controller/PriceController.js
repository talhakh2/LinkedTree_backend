import Price from "../Models/priceModel.js"

export const getPrice = async (req, res) => {
    try {
        const data = await Price.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json(err);
    }
}
export const updateMonthlyPrice = async (req, res) => {
    const { updatedData } = req.body;
    try {
        const data = await Price.findOneAndUpdate(
            { _id: updatedData._id },
            updatedData,
            { new: true }
        );
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateYearlyPrice = async (req, res) => {
    const { updatedData } = req.body;
    try {
        const data = await Price.findByIdAndUpdate(
            updatedData._id,
            updatedData,
            { new: true }
        );
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};