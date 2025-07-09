import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/hospede/login', authController.loginHospede);
router.post('/hotel/login', authController.loginHotel);

export default router;