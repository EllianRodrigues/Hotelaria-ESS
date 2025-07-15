import express from 'express';
import reservationRouter from './reservationRouter.js';
import roomRouter from './roomRouter.js';
import hospedeController from '../controllers/hospedeController.js';
import hotelController from '../controllers/hotelController.js';
import authRouter from './authRouter.js';
import adminRouter from './adminRouter.js';

const router = express.Router();

// router.use('/hotels', hotelRouter)
router.use('/rooms', roomRouter);
router.use('/reservations', reservationRouter);
router.use('/admin', adminRouter);
// router.get('/users', userController.getAllUsers);

//////////////Ellian//////////////////////
router.get('/hospedes', hospedeController.getAllHospedes);
router.get('/hotels', hotelController.getAllHotels);

router.post('/hospedes', hospedeController.createHospede);
router.post('/hotels', hotelController.createHotelFull);

router.get('/hospedes/:id', hospedeController.getHospedeById);
router.get('/hotels/:id', hotelController.getHotelById); 

router.put('/hospedes/:id', hospedeController.updateHospede);
router.put('/hotels/:id', hotelController.updateHotel);

router.put('/hospedes/:id/password', hospedeController.updateHospedePassword);
router.put('/hotels/:id/password', hotelController.updateHotelPassword);

router.use('/auth', authRouter);
/////////////////////////////////////////

export default router; 