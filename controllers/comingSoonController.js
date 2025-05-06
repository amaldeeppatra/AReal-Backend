const ComingSoon = require("../models/ComingSoon");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendSubscriptionAlert = async (subscriberEmail) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, 
        subject: "New Coming Soon Subscription",
        text: `A new user has subscribed with the email: ${subscriberEmail}`,
    };

    await transporter.sendMail(mailOptions);
};

exports.subscribeEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const existing = await ComingSoon.findOne({ email });

        if (existing) {
            return res.status(409).json({ message: "Email already subscribed." });
        }

        const newEntry = new ComingSoon({ email });
        await newEntry.save();

        // Send admin email alert
        await sendSubscriptionAlert(email);

        res.status(201).json({ message: "Successfully subscribed." });
    } catch (error) {
        console.error("Subscription error:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};
