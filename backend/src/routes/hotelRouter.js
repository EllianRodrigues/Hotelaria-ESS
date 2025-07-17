import express from 'express';
import { createHotel } from '../controllers/hotelController.js';

const router = express.Router();

router.post('/', createHotel);

export default router;