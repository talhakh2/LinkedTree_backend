import Game from "../Models/gameManagement.js"
import Registration from '../Models/RegisterationModel.js';



export const createLandingPage = async (req, res) => {
    try {
        const userData = await Registration.findById(req.body.gameFormat.ownerId);

        if (!userData) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        if (!userData.isToggle) {
            return res.status(400).json({ message: "Vous êtes restreint par l'administrateur pour créer une page de destination" });
        }

        if (userData.isTrial) {
            if (userData.isTrialVerified) {
                const totalLandingPages = await Game.find({ ownerId: req.body.gameFormat.ownerId });

                if (totalLandingPages.length >= 1) {
                    return res.status(400).json({ message: "Vous ne pouvez avoir qu'une seule page de destination pendant la période d'essai" });
                }
            } else {
                return res.status(400).json({ message: "Veuillez attendre l'approbation de l'administrateur" });
            }
        } else {
            if (userData.paymentDone) {
                const expiryDate = new Date(userData.expiryDate);

                if (expiryDate < new Date()) {
                    return res.status(400).json({ message: "Veuillez renouveler votre abonnement" });
                } else {
                    const totalLandingPages = await Game.find({ ownerId: req.body.gameFormat.ownerId });

                    if (totalLandingPages.length >= userData.landingPages) {
                        return res.status(400).json({ message: `Vous ne pouvez créer que ${userData.landingPages} pages de destination` });
                    }
                }
            } else {
                return res.status(400).json({ message: "Veuillez payer votre abonnement" });
            }
        }

        const data = await Game.create({ ...req.body.gameFormat, expiryDate: userData.expiryDate });
        return res.status(200).json(data);
    } catch (err) {
        console.error('Erreur lors de la création de la page de destination:', err);
        return res.status(500).json({ message: "Erreur interne du serveur" });
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

export const manageToggle = async (req, res) => {
    const { id, action } = req.params;
    try {
        if (!id)
            return res.status(400).json({ status: "failed", message: "id is required" });
        const game = await Game.findByIdAndUpdate(id, { toggle: action }, { new: true });
        if (!game)
            return res.status(404).json({ status: "failed", message: "game not found" });
        return res.status(200).json(game);
    } catch (err) {
        console.error('Error managing user:', err);
        return res.status(500).json({ status: "failed", message: "Internal server error" });
    }
};

