import ReviewModel from "../Models/ReviewsModel.js";
import jwt from 'jsonwebtoken'
import Registration from '../Models/RegisterationModel.js';
import paymentModel from "../Models/paymentHistoryModel.js"
import Game from "../Models/gameManagement.js"
// import { sendVerificationEmail } from '../utils/sendVerificationEmail.js';
import SubAccountsModel from "../Models/SubAccounts.js";
import { Resend } from "resend"

const resend = new Resend("re_55SZ9Msc_B795Z4pRmpKaN2pnhTbt1TfT");

async function sendVerificationEmail(email, id){
    const data = await resend.emails.send({
        from: 'Onboarding <onboarding@ffsboyswah.com>',
        to: `${email}`,
        subject: 'Onboarding Verficiation Email Linkedtree',
        html: `<p>Thanks for Registering you can verify by clicking the below Link <br/> <strong> <a href="http://195.200.14.117/verify?id=${id}">http://195.200.14.117/verify?id=${id}</a></strong>!</p>`
    });
}

export const RegisterUser = async (req, res) => {
    try {
        const tempData = await Registration.findOne({ email: req.body.email });
        if (tempData) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const registration = new Registration({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            isTrial: req.body.isTrial,
        });
        if(req.body.isTrial){
            await resend.emails.send({
                from: 'Trial Confirmation <onboarding@ffsboyswah.com>',
                to: `${req.body.email}`,
                subject: 'Onboarding Verficiation Email Linkedtree',
                html: `<p>Thanks for Registering. Your Trial is sent to admin for the verification. As soon as admin will verify your trial you will recieve a verification email.!</p>`
            });
        }else{
            await sendVerificationEmail(req.body.email, registration._id);
        }
        await registration.save();
        return res.status(200).json({ message: 'Registration Successful', registration });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const verifyUser = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Registration.findById(id);
        if (!data) throw new Error("User not found");
        data.isVerified = true;
        await data.save();
        return res.status(200).json({
            status: "success",
            message: "User verified successfully"
        })
    } catch (err) {
        return res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.query;
        const user = await Registration.findOne({ email });
        if (!user) {
            const subAccountUser = await SubAccountsModel.findOne({ email });
            if (subAccountUser) {
                const token = jwt.sign({ userId: subAccountUser._id }, process.env.ENCRYPTION_SECRET, { expiresIn: '1d' });
                return res.status(200).json({ message: 'Login successful', token, isVerified: true, payment: true, userId: subAccountUser._id, name: subAccountUser.name, accountType: 'sub', ownerId: subAccountUser.ownerId });
            }
            throw new Error('Invalid email or password');
        }
        if (user.password !== password) {
            throw new Error('Invalid email or password');
        }
        if (!user.isVerified) {
            await sendVerificationEmail(user.email, user._id);
        }
        user.lastLogin = new Date();
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.ENCRYPTION_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ message: 'Login successful', token, isVerified: user.isVerified, payment: user.paymentDone, userId: user._id, name: user.name, accountType: 'main', isTrial: user.isTrial, ownerId: null });
    } catch (err) {
        return res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
}


export const sendEmail = async (req, res) => {
    const email = req.body.email;
    try {
        if (!email) {
            throw new Error('email is required');
        }
        const user = await Registration.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        await sendVerificationEmail(email, user._id);
        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (err) {
        return res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
}

export const getUserData = async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            throw new Error('id is required');
        }
        const user = await Registration.findById(id);
        return res.status(200).json(user);
    } catch (err) {
        return res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
}

export const getTrialUser = async (req, res) => {
    try {
        const user = await Registration.find({isTrial: true, });
        return res.status(200).json(user);
    } catch (err) {
        return res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await Registration.find({ email: { $ne: 'admin@gmail.com' } });

        // Map over users and fetch associated games
        const data = await Promise.all(users.map(async (item) => {
            const games = await Game.find({ ownerId: item._id });

            // Ensure that item is a plain object before spreading
            const itemObj = item.toObject();

            return {
                ...itemObj,
                pages: games.length,
                access: games.some(game => game.isTrial) ? 'Trial' : (item.accountType === 'main' ? 'Owner' : 'Sub')
            };
        }));

        return res.status(200).json(data);
    } catch (err) {
        return res.status(400).json({
            status: "failed",
            message: err.message
        });
    }
};

export const getAllPages = async (req, res) => {
    try {
        // Step 1: Fetch all games
        const games = await Game.find();

        // Step 2: Process each game to fetch owner and reviews data
        const data = await Promise.all(games.map(async (game) => {
            // Fetch the owner (user) details
            const owner = await Registration.findById(game.ownerId);
            const ownerName = owner ? owner.name : 'Unknown';

            // Fetch the reviews for the game owner
            const reviews = await ReviewModel.find({ ownerId: game.ownerId });
            const reviewCount = reviews.length;

            // Construct the response object
            return {
                ...game.toObject(), // Ensure game is a plain object
                ownerName,
                reviews: reviewCount,
            };
        }));

        // Send the constructed data as response
        return res.status(200).json(data);
    } catch (err) {
        return res.status(400).json({
            status: "failed",
            message: err.message
        });
    }
};

export const updateTrialUser = async (req, res) => {
    try {
        const id = req.query.id;
        const user = await Registration.findById(id);
        user.isTrialVerified = true;
        await user.save();
        await sendVerificationEmail(user.email, user._id);
        return res.status(200).json(user);
    } catch (err) {
        return res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
}

export const updateUserData = async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            throw new Error('id is required');
        }
        const user = await Registration.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json(user);
    } catch (err) {
        return res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
}

export const getAdminDashboardData = async (req, res) => {
    try{
        const users = await Registration.find();
        const payments = await paymentModel.find();
        let total = 0;
        for(const paymentData of payments){
            total += paymentData.amount;
        }

        return res.status(200).json({
            users: users.length -1 ,
            revenue: total
        });
    } catch (err) {
        return res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
}