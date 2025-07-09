import express from 'express';
import reservationController from '../controllers/reservationController.js';

const router = express.Router();

router.post('/', reservationController.createReservation);

export default router;