const express = require('express');
const router = express.Router();
const { createHotel } = require('../controllers/hotelController');

router.post('/', createHotel);

module.exports = router;
