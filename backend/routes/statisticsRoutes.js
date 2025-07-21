// Feito por Juliano Matheus Ferreira

const express = require('express');
const router = express.Router();
const EstatisticasCtrl = require('../controllers/StatisticsController');

// Todas as estatísticas
router.get('/tudo', EstatisticasCtrl.tudo);

// Resumo geral
router.get('/resumo', EstatisticasCtrl.resumo);

// Por cidade
router.get('/cidades', EstatisticasCtrl.porCidade);

// Reservas por mês
router.get('/meses', EstatisticasCtrl.reservasPorMes);

// Top hotéis
router.get('/top', EstatisticasCtrl.topHoteis);

// Por tipo de quarto
router.get('/tipos-quarto', EstatisticasCtrl.porTipoQuarto);

// Por estação
router.get('/estacoes', EstatisticasCtrl.porEstacao);

// Métricas avançadas
router.get('/metricas-avancadas', EstatisticasCtrl.metricasAvancadas);

// Tendências
router.get('/tendencias', EstatisticasCtrl.tendencias);

// Limpar cache
router.post('/limpar-cache', EstatisticasCtrl.limparCache);

module.exports = router; 