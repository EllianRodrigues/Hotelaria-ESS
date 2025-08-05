import Statistics from '../models/statistics.js';

// Cache em memória para estatísticas (5 minutos)
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em millisegundos

// Função para verificar se cache é válido
const isCacheValid = (key) => {
  const cached = cache.get(key);
  if (!cached) return false;
  return Date.now() - cached.timestamp < CACHE_DURATION;
};

// Função para obter dados do cache ou executar query
const getCachedOrExecute = async (key, queryFunction) => {
  if (isCacheValid(key)) {
    return cache.get(key).data;
  }
  
  const data = await queryFunction();
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
  
  return data;
};

// Resumo Geral - Visão completa do sistema
export async function getOverviewStats(req, res) {
  try {
    const stats = await getCachedOrExecute('overview', () => Statistics.getOverview());
    
    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
      cache: isCacheValid('overview') ? 'hit' : 'miss'
    });
  } catch (err) {
    console.error('Erro ao obter estatísticas gerais:', err);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: err.message
    });
  }
}

// Estatísticas por Mês - Tendências temporais
export async function getStatsByMonth(req, res) {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const cacheKey = `month-${year}`;
    
    const stats = await getCachedOrExecute(cacheKey, () => Statistics.getByMonth(year));
    
    res.status(200).json({
      success: true,
      data: stats,
      year: year,
      timestamp: new Date().toISOString(),
      cache: isCacheValid(cacheKey) ? 'hit' : 'miss'
    });
  } catch (err) {
    console.error('Erro ao obter estatísticas por mês:', err);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: err.message
    });
  }
}

// Top Hotéis - Ranking por performance
export async function getTopHotels(req, res) {
  try {
    const stats = await getCachedOrExecute('top-hotels', () => Statistics.getTopHotels());
    
    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
      cache: isCacheValid('top-hotels') ? 'hit' : 'miss'
    });
  } catch (err) {
    console.error('Erro ao obter top hotéis:', err);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: err.message
    });
  }
}

// Estatísticas por Tipo de Quarto
export async function getStatsByRoomType(req, res) {
  try {
    const stats = await getCachedOrExecute('room-types', () => Statistics.getByRoomType());
    
    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
      cache: isCacheValid('room-types') ? 'hit' : 'miss'
    });
  } catch (err) {
    console.error('Erro ao obter estatísticas por tipo de quarto:', err);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: err.message
    });
  }
}

// Estatísticas por Estação
export async function getStatsBySeason(req, res) {
  try {
    const stats = await getCachedOrExecute('seasons', () => Statistics.getBySeason());
    
    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
      cache: isCacheValid('seasons') ? 'hit' : 'miss'
    });
  } catch (err) {
    console.error('Erro ao obter estatísticas por estação:', err);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: err.message
    });
  }
}

// Métricas Avançadas
export async function getAdvancedMetrics(req, res) {
  try {
    const stats = await getCachedOrExecute('advanced', () => Statistics.getAdvancedMetrics());
    
    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
      cache: isCacheValid('advanced') ? 'hit' : 'miss'
    });
  } catch (err) {
    console.error('Erro ao obter métricas avançadas:', err);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: err.message
    });
  }
}

// Tendências
export async function getTrends(req, res) {
  try {
    const stats = await getCachedOrExecute('trends', () => Statistics.getTrends());
    
    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
      cache: isCacheValid('trends') ? 'hit' : 'miss'
    });
  } catch (err) {
    console.error('Erro ao obter tendências:', err);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: err.message
    });
  }
}

// Health Check para o sistema de estatísticas
export async function getStatsHealth(req, res) {
  try {
    res.status(200).json({
      success: true,
      service: 'Statistics API',
      status: 'healthy',
      uptime: process.uptime(),
      cache: {
        size: cache.size,
        duration: `${CACHE_DURATION / 1000}s`
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Erro no health check:', err);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: err.message
    });
  }
}

// Limpar cache (útil para desenvolvimento)
export async function clearCache(req, res) {
  try {
    const oldSize = cache.size;
    cache.clear();
    
    res.status(200).json({
      success: true,
      message: 'Cache limpo com sucesso',
      cleared_entries: oldSize,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Erro ao limpar cache:', err);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: err.message
    });
  }
}

// Estatísticas específicas de um hotel (para dashboard do hotel)
export async function getHotelStats(req, res) {
  try {
    const { hotelId } = req.params;
    console.log(`[STATISTICS] GET /hotel/${hotelId} - ${new Date().toISOString()}`);
    
    if (!hotelId) {
      return res.status(400).json({
        success: false,
        error: 'ID do hotel é obrigatório'
      });
    }

    const cacheKey = `hotel_stats_${hotelId}`;
    const stats = await getCachedOrExecute(cacheKey, async () => {
      
      // Buscar informações do hotel
      const hotelInfo = await Statistics.getHotelById(hotelId);
      if (!hotelInfo) {
        throw new Error('Hotel não encontrado');
      }

      // Buscar quartos do hotel
      const rooms = await Statistics.getRoomsByHotel(hotelId);
      
      // Buscar reservas do hotel
      const reservations = await Statistics.getReservationsByHotel(hotelId);
      
      // Calcular métricas
      const totalRooms = rooms.length;
      const totalReservations = reservations.length;
      const totalRevenue = reservations.reduce((sum, r) => sum + (r.total_cost || 0), 0);
      
      // Taxa de ocupação (simplificada)
      const occupiedRooms = reservations.filter(r => {
        const now = new Date();
        const startDate = new Date(r.start_date);
        const endDate = new Date(r.end_date);
        return startDate <= now && now <= endDate;
      }).length;
      
      const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
      
      // Tipos de quarto
      const roomTypeStats = rooms.reduce((acc, room) => {
        const type = room.type;
        if (!acc[type]) {
          acc[type] = { type, count: 0, totalCost: 0 };
        }
        acc[type].count++;
        acc[type].totalCost += room.cost;
        return acc;
      }, {});
      
      const roomTypes = Object.values(roomTypeStats).map(type => ({
        ...type,
        avgPrice: type.count > 0 ? type.totalCost / type.count : 0
      }));
      
      // Reservas recentes (últimas 10)
      const recentReservations = reservations
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10)
        .map(r => ({
          ...r,
          status: new Date(r.end_date) >= new Date() ? 'active' : 'completed'
        }));

      return {
        hotel: hotelInfo,
        totalRooms,
        totalReservations,
        totalRevenue,
        occupancyRate,
        avgMonthlyRevenue: totalRevenue / 12, // Estimativa simples
        roomTypes,
        rooms: rooms.map(room => ({
          ...room,
          occupied: occupiedRooms > 0 // Simplificado
        })),
        reservations: recentReservations
      };
    });

    res.status(200).json({
      success: true,
      data: stats,
      message: `Estatísticas do hotel ${hotelId}`,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('Erro ao buscar estatísticas do hotel:', err);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: err.message
    });
  }
}

// Alias para compatibilidade
export async function getRoomTypeStats(req, res) {
  return getStatsByRoomType(req, res);
}

// Função para obter todas as estatísticas agregadas
export async function getAllStats(req, res) {
  try {
    console.log(`[STATISTICS] GET /all - ${new Date().toISOString()}`);
    
    const cacheKey = 'all_stats';
    const allStats = await getCachedOrExecute(cacheKey, async () => {
      
      // Buscar todas as estatísticas em paralelo
      const [
        overview,
        monthStats,
        topHotels,
        roomTypeStats,
        seasonStats,
        advancedMetrics,
        trends
      ] = await Promise.all([
        Statistics.getOverview(),
        Statistics.getByMonth(),
        Statistics.getTopHotels(),
        Statistics.getByRoomType(),
        Statistics.getBySeason(),
        Statistics.getAdvancedMetrics(),
        Statistics.getTrends()
      ]);

      return {
        overview,
        monthStats,
        topHotels,
        roomTypeStats,
        seasonStats,
        advancedMetrics,
        trends
      };
    });

    res.status(200).json({
      success: true,
      data: allStats,
      message: 'Todas as estatísticas obtidas com sucesso',
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('Erro ao buscar todas as estatísticas:', err);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: err.message
    });
  }
}
