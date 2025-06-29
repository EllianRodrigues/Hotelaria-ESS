const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const roomRouter = require('./roomRouter');

router.get('/users', userController.getAllUsers);
router.use('/rooms', roomRouter)

module.exports = router; 