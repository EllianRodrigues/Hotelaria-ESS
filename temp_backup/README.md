# 🏨 API de Estatísticas de Hotelaria

**Feito por Juliano Matheus Ferreira**

Sistema completo de estatísticas para hotelaria com backend em Node.js, Express e SQLite. Desenvolvido com foco em performance, segurança e facilidade de uso.

## ✨ Funcionalidades

### 📊 Estatísticas Disponíveis
- **Resumo Geral**: Visão completa do sistema
- **Por Cidade**: Análise de ocupação por localização
- **Por Mês**: Tendências temporais de reservas
- **Top Hotéis**: Ranking por receita e performance
- **Por Tipo de Quarto**: Análise de preferências
- **Por Estação**: Comportamento sazonal
- **Métricas Avançadas**: Indicadores de performance
- **Tendências**: Análise de crescimento

### 🚀 Recursos Técnicos
- **Cache Inteligente**: Performance otimizada com cache em memória
- **Segurança**: Helmet, rate limiting, CORS configurado
- **Logging**: Sistema completo de logs com Morgan
- **Compressão**: Respostas otimizadas com gzip
- **Health Check**: Monitoramento de saúde da API
- **Graceful Shutdown**: Encerramento seguro do servidor
- **Tratamento de Erros**: Sistema robusto de tratamento de exceções

## 🛠️ Tecnologias

- **Backend**: Node.js + Express
- **Banco**: SQLite3
- **Segurança**: Helmet, express-rate-limit
- **Performance**: Compression, cache em memória
- **Testes**: Jest + Supertest
- **Linting**: ESLint

## 📦 Instalação

```bash
# Clonar repositório
git clone <url-do-repositorio>
cd Estatistc.Hotel

# Instalar dependências
npm install

# Iniciar servidor
npm start
```

## 🎯 Uso da API

### Endpoints Principais

#### Resumo Geral
```bash
GET /api/estatisticas/resumo
```

**Resposta:**
```json
{
  "ok": true,
  "mensagem": "Resumo geral",
  "dados": {
    "hospedes": 8,
    "hoteis": 5,
    "quartos": 16,
    "quartosDisponiveis": 13,
    "reservas": 10,
    "taxaOcupacao": 18.75,
    "receita": 10860,
    "mediaNoites": 2.4
  }
}
```

#### Por Cidade
```bash
GET /api/estatisticas/cidades
```

#### Reservas por Mês
```bash
GET /api/estatisticas/meses
```

#### Top Hotéis
```bash
GET /api/estatisticas/top
```

#### Por Tipo de Quarto
```bash
GET /api/estatisticas/tipos-quarto
```

#### Por Estação
```bash
GET /api/estatisticas/estacoes
```

#### Métricas Avançadas
```bash
GET /api/estatisticas/metricas-avancadas
```

#### Tendências
```bash
GET /api/estatisticas/tendencias
```

#### Todas as Estatísticas
```bash
GET /api/estatisticas/tudo
```

#### Health Check
```bash
GET /health
```

#### Limpar Cache
```bash
POST /api/estatisticas/limpar-cache
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

## 🔧 Scripts Disponíveis

```bash
npm start          # Iniciar servidor
npm run dev        # Modo desenvolvimento
npm test           # Executar testes
npm run lint       # Verificar código
npm run lint:fix   # Corrigir problemas de linting
npm run docs       # Gerar documentação
npm run security   # Verificar vulnerabilidades
```

## 📁 Estrutura do Projeto

```
Estatistc.Hotel/
├── backend/
│   ├── config/
│   │   └── config.js              # Configurações do sistema
│   ├── controllers/
│   │   └── StatisticsController.js # Controladores da API
│   ├── database/
│   │   └── database.js            # Configuração do banco
│   ├── models/
│   │   └── StatisticsModel.js     # Modelo de dados
│   ├── routes/
│   │   └── statisticsRoutes.js    # Rotas da API
│   ├── __tests__/
│   │   └── statistics.test.js     # Testes automatizados
│   └── server.js                  # Servidor principal
├── package.json
├── .eslintrc.js                   # Configuração ESLint
├── .gitignore                     # Arquivos ignorados
└── README.md                      # Documentação
```

## 🔒 Segurança

- **Helmet**: Headers de segurança
- **Rate Limiting**: Proteção contra spam (100 req/15min)
- **CORS**: Configurado para permitir acesso
- **Validação**: Tratamento robusto de erros
- **Sanitização**: Proteção contra injeção SQL

## ⚡ Performance

- **Cache**: 5 minutos de cache em memória
- **Compressão**: Gzip para todas as respostas
- **Otimização**: Queries SQL otimizadas
- **Graceful Shutdown**: Encerramento seguro

## 📊 Banco de Dados

### Tabelas
- **hotels**: Informações dos hotéis
- **rooms**: Quartos disponíveis
- **hospedes**: Dados dos hóspedes
- **reservations**: Histórico de reservas

### Dados de Exemplo
O sistema inclui dados de exemplo com:
- 5 hotéis de luxo
- 16 quartos variados
- 8 hóspedes
- 10 reservas históricas

## 🚀 Deploy

### Variáveis de Ambiente
```bash
PORT=3000                    # Porta do servidor
NODE_ENV=production          # Ambiente
DB_PATH=./database/hotel.db  # Caminho do banco
CORS_ORIGIN=*               # Origem CORS
LOG_LEVEL=info              # Nível de log
```

### Docker (Opcional)
```bash
# Construir imagem
docker build -t hotelaria-api .

# Executar container
docker run -p 3000:3000 hotelaria-api
```

## 📈 Monitoramento

### Health Check
```bash
curl http://localhost:3000/health
```

**Resposta:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": "2h 15m 30s",
  "memoria": {
    "rss": "45MB",
    "heapUsed": "25MB",
    "heapTotal": "35MB"
  },
  "versao": "v18.17.0",
  "ambiente": "production"
}
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

**Juliano Matheus Ferreira**

---

⭐ Se este projeto te ajudou, considere dar uma estrela!