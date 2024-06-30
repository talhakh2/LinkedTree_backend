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
app.post('/result', async (req, res) => {
    const data = await resend.emails.send({
        from: 'Gift Card <linkedtree@ffsboyswah.com>',
        to: `${req.body.email}`,
        subject: 'Onboarding Verficiation Email Linkedtree',
        html: `<p>Congratulation on Winning ${req.body.selectedGift}. <br/> ${req.body.message}</p>`
    });
    res.status(200).json({
        status: "success",
    })
});

app.use('*', (req, res) => {
    res.status(200).json({
        status: "server started"
    })
})

const PORT = process.env.PORT || 8080

connectDB().then(()=>{
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
})