// Feito por Juliano Matheus Ferreira

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

// Importar configurações
const config = require('./config/config');
const database = require('./database/database');

// Importar rotas
const estatisticasRoutes = require('./routes/statisticsRoutes');

// Criar aplicação
const app = express();

// Configurar middleware de segurança
app.use(helmet());

// Configurar rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    ok: false,
    mensagem: 'Muitas requisições. Tente novamente em 15 minutos.'
  }
});
app.use('/api/', limiter);

// Configurar compressão
app.use(compression());

// Configurar logging
app.use(morgan('combined'));

// Configurar JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configurar CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Rota de saúde
app.get('/health', (req, res) => {
  const uptime = process.uptime();
  const memoria = process.memoryUsage();
  
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
    memoria: {
      rss: `${Math.round(memoria.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoria.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoria.heapTotal / 1024 / 1024)}MB`
    },
    versao: process.version,
    ambiente: process.env.NODE_ENV || 'desenvolvimento'
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    ok: true,
    mensagem: 'API de Estatísticas de Hotelaria',
    versao: '1.0.0',
    autor: 'Juliano Matheus Ferreira',
    endpoints: {
      resumo: '/api/estatisticas/resumo',
      cidades: '/api/estatisticas/cidades',
      meses: '/api/estatisticas/meses',
      top: '/api/estatisticas/top',
      tipos: '/api/estatisticas/tipos-quarto',
      estacoes: '/api/estatisticas/estacoes',
      metricas: '/api/estatisticas/metricas-avancadas',
      tendencias: '/api/estatisticas/tendencias',
      tudo: '/api/estatisticas/tudo',
      health: '/health'
    }
  });
});

// Configurar rotas da API
app.use('/api/estatisticas', estatisticasRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  
  res.status(err.status || 500).json({
    ok: false,
    mensagem: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    ok: false,
    mensagem: 'Rota não encontrada',
    rota: req.originalUrl
  });
});

// Função para iniciar servidor
function iniciarServidor() {
  const porta = config.porta;
  
  const servidor = app.listen(porta, () => {
    const data = new Date();
    console.log('🚀 Servidor rodando na porta', porta);
    console.log('📊 API:', `http://localhost:${porta}`);
    console.log('❤️  Health:', `http://localhost:${porta}/health`);
    console.log('📈 Estatísticas:', `http://localhost:${porta}/api/estatisticas/resumo`);
    console.log('⏰ Iniciado em:', data.toLocaleDateString('pt-BR'), data.toLocaleTimeString('pt-BR'));
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 Recebido SIGTERM. Encerrando servidor...');
    servidor.close(() => {
      console.log('✅ Servidor encerrado.');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('🛑 Recebido SIGINT. Encerrando servidor...');
    servidor.close(() => {
      console.log('✅ Servidor encerrado.');
      process.exit(0);
    });
  });

  return servidor;
}

// Iniciar se for o arquivo principal
if (require.main === module) {
  iniciarServidor();
}

module.exports = app; 