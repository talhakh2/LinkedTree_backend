import Game from "../Models/gameManagement.js"
import Registration from '../Models/RegisterationModel.js';

const getGameFormat = () => {
    const gameFormat = {
        ownerId: '',
        brandName: '',
        logo: '',
        options: {
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            option5: '',
            option6: '',
            option7: '',
            option8: '',
        },
        instagram: '',
        tiktok: '',
        facebook: '',
        googleMaps: '',
        twitter: '',
        content: '',
    }
}

export const createLandingPage = async (req, res) => {
    try {
        console.log(req.body)
        const userData = await Registration.findById(req.body.gameFormat.ownerId);
        if (userData.isTrial) {
            if (userData.isTrialVerified) {
                const totalLaningPages = await Game.find({ ownerId: req.body.gameFormat.ownerId });
                if (totalLaningPages.length > 1) {
                    throw new Error("You can only have one landing page");
                }
            } else {
                throw new Error("Please Verify Your Trial");
            }
        } else {
            if (userData.paymentDone) {
                const date = userData.expiryDate;
                if (date < Date.now()) {
                    throw new Error("Please Renew Your Subscription");
                } else {
                    const totalLaningPages = await Game.find({ ownerId: req.body.gameFormat.ownerId });
                    if (totalLaningPages.length > 10) {
                        throw new Error("You can only create 10 landing pages");
                    }
                }
            } else {
                throw new Error("Please Pay Your Subscription");
            }
        }
        const data = await Game.create(req.body.gameFormat);
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const getALLLandingPages = async (req, res) => {
    try {
        const { owner } = req.query;
        const data = await Game.find({ ownerId: owner });
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json(err);
    }
}

export const getALLLandingPagesByOwner = async (req, res) => {
    try {
        const { owner } = req.params;
        const data = await Game.find({ ownerId: owner });
        let instaCount = 0, facebookCount = 0, googleMapsCount = 0, twitterCount = 0, totalClicks = 0;
        data.forEach(element => {
            instaCount += element.instagramClicks;
            facebookCount += element.facebookClicks;
            googleMapsCount += element.googleMapsClicks;
            twitterCount += element.twitterClicks;
            totalClicks += element.visitedMembers;
        })
        res.status(200).json({ instaCount, facebookCount, googleMapsCount, twitterCount, totalClicks });
    } catch (err) {
        res.status(400).json(err);
    }
}

export const getSingleLandingPages = async (req, res) => {
    try {
        const { pageId } = req.query;
        const data = await Game.findById(pageId);
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json(err);
    }
}

export const getLandingPages = async (req, res) => {
    try {
        const { pageId } = req.query;
        const data = await Game.findById(pageId);
        data.visitedMembers += 1;
        await data.save();
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json(err);
    }
}

export const updateLandingPage = async (req, res) => {
    const { pageId } = req.params;
    try {
        const data = await Game.findByIdAndUpdate(pageId, req.body.gameFormat, { new: true });
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json(err);
    }
}

