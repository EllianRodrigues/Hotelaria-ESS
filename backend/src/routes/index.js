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

//Ellian
// Rotas GET para listar todos
router.get('/hospedes', hospedeController.getAllHospedes);
router.get('/hotels', hotelController.getAllHotels);

// Rotas POST para criar
router.post('/hospedes', hospedeController.createHospede);
router.post('/hotels', hotelController.createHotel);

// ESTAS ROTAS GET POR ID SÃO ESSENCIAIS PARA CARREGAR OS DADOS NA EDIÇÃO
router.get('/hospedes/:id', hospedeController.getHospedeById);
router.get('/hotels/:id', hotelController.getHotelById); // Garanta que esta também está correta no hotelController

// Rotas PUT para atualizar dados de perfil
router.put('/hospedes/:id', hospedeController.updateHospede);
router.put('/hotels/:id', hotelController.updateHotel);

// Rotas PUT para atualizar senha
router.put('/hospedes/:id/password', hospedeController.updateHospedePassword);
router.put('/hotels/:id/password', hotelController.updateHotelPassword);

// Rotas de Autenticação
router.use('/auth', authRouter);

module.exports = router; 