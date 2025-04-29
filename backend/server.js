import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import donationRoutes from './routes/donationRoutes.js';

const app = express();
const port = 6000;

connectDB();

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: 'http://13.61.179.126:5173' }));
app.use('/auth', userRoutes);
app.use('/', donationRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
