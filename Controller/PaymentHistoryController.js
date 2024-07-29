import { subDays, format } from 'date-fns';
import paymentModel from "../Models/paymentHistoryModel.js"
import Registration from '../Models/RegisterationModel.js';

import Game from '../Models/gameManagement.js';

// export const getPaymentHistory = async (req, res) => {
//     const ownerId = req.params.id;
//     try {
//         const data = await paymentModel.find({ ownerId });
//         res.status(200).json({
//             status: "success",
//             data
//         })
//     } catch (err) {
//         res.status(400).json({
//             status: "failed"
//         })
//     }
// }


export const getPaymentHistory = async (req, res) => {
    const ownerId = req.params.id;
    try {
        const [registrationData, paymentData, landingPagesData, landingPagesCount] = await Promise.all([
            Registration.findById(ownerId),
            paymentModel.find({ ownerId }),
            Game.find({ ownerId }),
            Game.countDocuments({ ownerId }), // This counts the documents
        ]);

        const combinedData = paymentData.map(payment => ({
            _id: payment._id,
            ownerId: payment.ownerId,
            plan: payment.plan,
            amount: payment.amount,
            paymentMethod: payment.paymentMethod,
            expiryDate: payment.expiryDate,
            landingPages: payment.landingPages,
            landingPagesCount: landingPagesCount ? landingPagesCount : 0,
            expiryDateUser: registrationData ? registrationData.expiryDate : null,
            // landingPages: registrationData ? registrationData.landingPages : null
        }));

        res.status(200).json({
            status: "success",
            data: combinedData,
            registrationData: registrationData
        });
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message: err.message
        });
    }
};


export const getSubscriptionCountsForPast10Dates = async (req, res) => {
    try {
        // Calculate the past 10 dates
        const dates = [];
        for (let i = 0; i < 10; i++) {
            const date = subDays(new Date(), 10 * i);
            dates.unshift(date);
        }

        // Initialize an array to hold the results
        const results = [];

        // For each date, query the database to count all records up to that date
        for (let i = 0; i < 10; i++) {
            let count;
            if (i === 0) {
                count = await paymentModel.countDocuments({
                    date: { $lte: dates[i] }
                });
            } else {
                count = await paymentModel.countDocuments({
                    date: { $gte: dates[i - 1], $lte: dates[i] }
                });
            }

            results.push({
                date: format(dates[i], 'dd-MM-yyyy'),
                subscriptionCount: count
            });
        }

        return res.status(200).json({
            status: "success",
            data: results
        });
    } catch (error) {
        console.error('Error fetching subscription counts:', error);
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};
