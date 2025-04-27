import express from 'express';
import bcrypt from 'bcrypt';
import User from '../schemas/user.js';
import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, age, email, username, city, password, type } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'This username is taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName, lastName, age, email, username, city, password: hashedPassword, type
        });

        await newUser.save();
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ message: 'User registered successfully', token });

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'No user found for this username' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Password' });
        }

        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ 
            status: 1, 
            message: 'Login successful', 
            token,
            user: {
                firstName: user.firstName, 
                lastName: user.lastName, 
                age: user.age, 
                email: user.email, 
                username: user.username, 
                city: user.city, 
                type: user.type
            }
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;