// Feito por Juliano Matheus Ferreira

// Configurações do sistema
const config = {
  // Configurações do servidor
  porta: process.env.PORT || 3000,
  
  // Configurações do banco
  banco: {
    caminho: process.env.DB_PATH || './database/hotelaria.db',
    modo: process.env.DB_MODE || 'development'
  },
  
  // Configurações de segurança
  seguranca: {
    rateLimit: {
      janela: 15 * 60 * 1000, // 15 minutos
      maximo: 100 // máximo de requests por IP
    },
    cors: {
      origem: process.env.CORS_ORIGIN || '*',
      metodos: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    }
  },
  
  // Configurações de cache
  cache: {
    duracao: 5 * 60 * 1000, // 5 minutos
    maximo: 100 // máximo de itens no cache
  },
  
  // Configurações de logging
  logging: {
    nivel: process.env.LOG_LEVEL || 'info',
    formato: process.env.LOG_FORMAT || 'combined'
  },
  
  // Configurações de ambiente
  ambiente: process.env.NODE_ENV || 'development',
  
  // Configurações de performance
  performance: {
    compressao: true,
    limiteJson: '10mb',
    timeout: 30000 // 30 segundos
  }
};

module.exports = config; 