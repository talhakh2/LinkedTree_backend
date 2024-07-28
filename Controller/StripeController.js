import Registration from '../Models/RegisterationModel.js';
import Game from '../Models/gameManagement.js';
import paymentModel from "../Models/paymentHistoryModel.js"
import stripe from 'stripe';

const stripeInstance = stripe("sk_test_51P7LLsLwSbXuk7vlss14tXpYT1bpq93ocxlpn3J72HGpFqBQyjzprEc4RfdlTgUnvuRXYF7dK8I14te1reVkqafn00JTwjHRIC");

export const monthlySessionCheckout = async (req, res) => {
    const session = await stripeInstance.checkout.sessions.create({
        mode: 'payment',
        success_url: `${process.env.BASE_URL}/success?sessionId={CHECKOUT_SESSION_ID}`,
        // success_url: `http://localhost:3009/checkout/success?sessionId={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}/login`,
        line_items: [
            {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: "Monthly Plan",
                        description: `What You’ll Get
                        1. Monitoring and Support
                        2. Access to Application
                        3. Data gathering
                        4. Dashboard
                        5. 10 landing pages per account
                        `,
                    },
                    unit_amount: req.query.amount * 100,
                },
                quantity: 1,
            },
        ],
        metadata: {
            plan: "Monthly",
            userId: req.query.userId,
            landingPages: req.query.landingPages
        },
    });

    return res.json({
        session: session
    })
}

export const yearlySessionCheckout = async (req, res) => {
    const session = await stripeInstance.checkout.sessions.create({
        mode: 'payment',
        success_url: `${process.env.BASE_URL}/success?sessionId={CHECKOUT_SESSION_ID}`,
        // success_url: `http://localhost:3009/checkout/success?sessionId={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}/login`,
        line_items: [
            {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: "Yearly Plan",
                        description: `What You’ll Get
                        1. Monitoring and Support
                        2. Access to Application
                        3. Data gathering
                        4. Dashboard
                        5. 10 landing pages per account for 12 months
                        `,
                    },
                    unit_amount: req.query.amount * 100,
                },
                quantity: 1,
            },
        ],
        metadata: {
            plan: "Yearly",
            userId: req.query.userId,
            landingPages: req.query.landingPages
        },
    });

    return res.json({
        session: session
    })
}


export const completePayment = async (req, res) => {
    const sessionId = req.query.sessionId;

    const session = await stripeInstance.checkout.sessions.retrieve(sessionId);
    const userData = session.metadata;
    const user = await Registration.findById(userData.userId);
    user.paymentDone = true;
    user.paymentType = userData.plan;
    user.landingPages = userData.landingPages;
    user.paymentDate = Date.now();

    if (user.isTrial){
        user.isTrial = false 
        user.isVerified = true
    }
    var expiryDate; 
    if(session.metadata.plan == "Yearly"){
        user.expiryDate = Date.now() + (365 * 24 * 60 * 60 * 1000);
        expiryDate = user.expiryDate
    }else if(session.metadata.plan == "Monthly"){
        user.expiryDate = Date.now() + (30 * 24 * 60 * 60 * 1000);
        expiryDate = user.expiryDate
    }
    await user.save();

    const data = await Game.updateMany(
        { ownerId: userData.userId },
        { $set: { expiryDate: expiryDate } }
    );

    console.log('Update Result:', {
        acknowledged: data.acknowledged,
        matchedCount: data.matchedCount,
        modifiedCount: data.modifiedCount
    });

    const paymentData = {
        ownerId: userData.userId,
        plan: userData.plan,
        amount: session.amount_total / 100,
        landingPages: userData.landingPages,
        expiryDate: expiryDate
    }
    await paymentModel.create(paymentData);
    return res.json({
        success: true
    });
}