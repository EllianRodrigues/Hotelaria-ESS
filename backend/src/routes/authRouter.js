const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/hospede/login', authController.loginHospede);
router.post('/hotel/login', authController.loginHotel);

module.exports = router;