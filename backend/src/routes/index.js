const express = require('express');
const router = express.Router();
const hotelRouter = require('./hotelRouter');
const reservationRouter = require('./reservationRouter');
const roomRouter = require('./roomRouter');
const userController = require('../controllers/userController');

router.use('/hotels', hotelRouter)
router.use('/rooms', roomRouter)
router.use('/reservations', reservationRouter)
router.get('/users', userController.getAllUsers);

module.exports = router; 