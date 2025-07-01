const express = require('express');
const router = express.Router();
const hotelRouter = require('./hotelRouter');
const reservationRouter = require('./reservationRouter');
const roomRouter = require('./roomRouter');
const userController = require('../controllers/userController');

const hospedeController = require('../controllers/hospedeController');
const hotelController = require('../controllers/hotelController');
const authRouter = require('./authRouter');

// router.use('/hotels', hotelRouter)
router.use('/rooms', roomRouter)
router.use('/reservations', reservationRouter)
// router.get('/users', userController.getAllUsers);

//////////////Ellian//////////////////////
router.get('/hospedes', hospedeController.getAllHospedes);
router.get('/hotels', hotelController.getAllHotels);

router.post('/hospedes', hospedeController.createHospede);
router.post('/hotels', hotelController.createHotel);

router.get('/hospedes/:id', hospedeController.getHospedeById);
router.get('/hotels/:id', hotelController.getHotelById); 

router.put('/hospedes/:id', hospedeController.updateHospede);
router.put('/hotels/:id', hotelController.updateHotel);

router.put('/hospedes/:id/password', hospedeController.updateHospedePassword);
router.put('/hotels/:id/password', hotelController.updateHotelPassword);

router.use('/auth', authRouter);
/////////////////////////////////////////

module.exports = router; 