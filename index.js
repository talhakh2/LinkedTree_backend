import express from "express"
import cors from "cors"
import { configDotenv } from "dotenv"
import RegisterationRoutes from "./Routes/RegisterationRoute.js";
import connectDB from "./config/MongooseConnection.js";
import StripeCheckout from "./Routes/StripeCheckoutRoute.js";
import paymentHistoryRoutes from "./Routes/paymentHistoryRoute.js";
import GameRoutes from "./Routes/GameManagement.js";
import { Resend } from "resend"
import subAccountRoutes from "./Routes/subAccountRoutes.js";
import reviewRoutes from "./Routes/ReviewRoutes.js";
import PriceRoutes from "./Routes/PriceRoute.js";

const resend = new Resend("re_55SZ9Msc_B795Z4pRmpKaN2pnhTbt1TfT");


configDotenv();
const app = express()
app.use(express.json())
app.use(cors())

app.use('/auth', RegisterationRoutes);
app.use('/sub/auth', subAccountRoutes);
app.use('/checkout', StripeCheckout);
app.use('/game', GameRoutes);
app.use('/review', reviewRoutes);
app.use('/payment/history', paymentHistoryRoutes);
app.use('/price', PriceRoutes);

app.post('/result', async (req, res) => {
    try {
        await resend.emails.send({
            from: 'Gift Card <onboarding@ffsboyswah.com>',
            to: `${req.body.email}`,
            subject: `Bravo ! vous avez reçu un cadeau de ${req.body.resturantName}`,
            html: `<div class="container">
                        <div class="content">
                            <p>Bravo, vous avez gagné ${req.body.selectedGift}!</p>
                            <p>Pour bénéficier pleinement de votre cadeau, nous vous invitons à vous rendre à l'adresse suivante, à la date de votre choix, et de présenter ce mail: </p>
                            <p><strong>${req.body.resturantName}</strong><br>
                                        ${req.body.resturantAddress}</p>
                            <p>Attention, votre cadeau n'est disponible que pendant une durée limitée de <strong>10 days</strong> jours à partir de demain ! Ne laissez pas cette occasion exceptionnelle vous échapper, saisissez-la dès maintenant et profitez-en au maximum! </p>
                            <p>Un minimum d’achat de 10 € est requis pour récupérer le cadeau.</p>
                        </div>
                        <div class="footer">
                            <p><strong>This is an automated message, please do not reply.</strong></p>
                        </div>
                    </div>`
        });

        res.status(200).json({
            status: "success",
            message: `Gift Card Sent to: ${req.body.email}`
        })
    } catch (err) {
        console.error('Error sending email:', err);
        throw new Error('Email sending failed');
    }
});




app.use('*', (req, res) => {
    res.status(200).json({
        status: "server started"
    })
})

const PORT = process.env.PORT || 8080

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
})