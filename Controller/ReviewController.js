import ReviewModel from "../Models/ReviewsModel.js";
import Spin from "../Models/spunUser.js";

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

export const checkUserSpin = async (req, res) => {
    const { email } = req.body;

    try {
      let spin = await Spin.findOne({ email });
  
      if (spin && spin.hasSpun) {
        return res.status(400).json({ message: 'Email has already been used to spin the wheel.' });
      }
  
      if (!spin) {
        spin = new Spin({ email, hasSpun: true });
        await spin.save();
      } else {
        spin.hasSpun = true;
        await spin.save();
      }
  
      res.json({ message: 'Spin registered.' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
}

