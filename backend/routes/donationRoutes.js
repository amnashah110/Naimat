import express from 'express';
import Donation from "../schemas/donations.js";

const router = express.Router();

router.post('/donate', async (req, res) => {
    try {
        const {
            username,
            foodType,
            quantity,
            contactInfo,
            pickupAddress,
            pickupTime,
            specificTime,
            specialInstructions
        } = req.body;

        const donationData = {
            username,
            foodType,
            quantity,
            contactInfo,
            pickupAddress,
            pickupTime,
            specialInstructions
        };

        if (pickupTime === 'custom') {
            donationData.specificTime = specificTime;
        }

        const newDonation = new Donation(donationData);
        await newDonation.save();

        res.status(201).json({ message: 'Donation added successfully' });

    } catch (error) {
        console.error('Error adding donation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
