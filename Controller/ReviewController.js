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

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    let spin = await Spin.findOne({ email });
    console.log(spin);

    const currentTime = Date.now();
    const sixtyDaysInMillis = 60 * 24 * 60 * 60 * 1000;

    if (spin) {
      if (currentTime > spin.expiryDate) {
        // Expiry date has passed, allow spin and reset expiry date
        spin.hasSpun = false;
        spin.expiryDate = currentTime + sixtyDaysInMillis;
      } else if (spin.hasSpun) {
        // Expiry date is still valid and user has already spun
        return res.status(400).json({ message: 'Email has already been used to spin the wheel within the last 60 days.' });
      }
    } else {
      // No spin record found, create a new one
      spin = new Spin({ email, hasSpun: true, expiryDate: currentTime + sixtyDaysInMillis });
      await spin.save();
    }

    // If spin record was found and hasSpun is now false, allow spinning again
    if (spin && !spin.hasSpun) {
      spin.hasSpun = true;
      await spin.save();
    }

    res.json({ message: 'Spin registered.' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

