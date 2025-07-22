// Feito por Juliano Matheus Ferreira

const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');

router.post('/', PaymentController.registrar);
router.get('/', PaymentController.listar);
router.get('/:id', PaymentController.buscarPorId);
router.get('/reserva/:reserva_id', PaymentController.listarPorReserva);
router.put('/:id/status', PaymentController.atualizarStatus);

module.exports = router; 