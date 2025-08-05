import express from 'express';
import { 
  getOverviewStats, 
  getTopHotels, 
  getRoomTypeStats, 
  getTrends, 
  getAllStats, 
  getStatsHealth, 
  clearCache,
  getHotelStats
} from '../controllers/statisticsController.js';

const router = express.Router();

// Middleware para logging de requisições de estatísticas
router.use((req, res, next) => {
  console.log(`[STATISTICS] ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Rotas de estatísticas gerais (admin)
router.get('/overview', getOverviewStats);
router.get('/top-hotels', getTopHotels);
router.get('/by-room-type', getRoomTypeStats);
router.get('/trends', getTrends);
router.get('/all', getAllStats);
router.get('/health', getStatsHealth);
router.delete('/cache', clearCache);

// Rota específica para estatísticas de hotel
router.get('/hotel/:hotelId', getHotelStats);

// Middleware para tratamento de erros específicos de estatísticas
router.use((err, req, res, next) => {
  console.error(`[STATISTICS ERROR] ${req.method} ${req.path}:`, err);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor de estatísticas',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

export default router;