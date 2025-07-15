import express from 'express';
import adminController from '../controllers/adminController.js';
// import { isAdmin } from '../middleware/authMiddleware.js'; // Middleware para proteger rotas

const router = express.Router();

// Rota de login para admin
router.post('/login', adminController.loginAdmin);

// Rotas de gerenciamento - Em um app real, proteja-as com middleware (ex: isAdmin)
router.get('/users', adminController.getAllUsers);
router.delete('/users/:userType/:id', adminController.deleteUser);

router.get('/reservations', adminController.getAllReservations);
router.delete('/reservations/:id', adminController.deleteReservation);

export default router;