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
        const userData = await Registration.findById(req.body.gameFormat.ownerId);

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!userData.isToggle){
            return res.status(400).json({ message: "You are restricted from admin to create landing page" });
        }

        if (userData.isTrial) {
            if (userData.isTrialVerified) {
                const totalLandingPages = await Game.find({ ownerId: req.body.gameFormat.ownerId });

                if (totalLandingPages.length >= 1) {
                    return res.status(400).json({ message: "You can only have one landing page during the trial period" });
                }
            } else {
                return res.status(400).json({ message: "Please verify your trial" });
            }
        } else {
            if (userData.paymentDone) {
                const expiryDate = new Date(userData.expiryDate);

                if (expiryDate < new Date()) {
                    return res.status(400).json({ message: "Please renew your subscription" });
                } else {
                    const totalLandingPages = await Game.find({ ownerId: req.body.gameFormat.ownerId });

                    if (totalLandingPages.length >= userData.landingPages) {
                        return res.status(400).json({ message: `You can only create ${userData.landingPages} landing pages` });
                    }
                }
            } else {
                return res.status(400).json({ message: "Please pay your subscription" });
            }
        }

        const data = await Game.create(req.body.gameFormat);
        return res.status(200).json(data);
    } catch (err) {
        console.error('Error creating landing page:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
};


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

