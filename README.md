# Sistema de Hotelaria - Projeto ESS

**Feito por Juliano Matheus Ferreira**

Este repositório contém um sistema completo de hotelaria, desenvolvido como parte da disciplina de **Engenharia de Software e Sistemas (ESS)**, incluindo funcionalidades avançadas de estatísticas e análise de dados.

## ✨ Funcionalidades

### 🏨 Sistema Principal
- **Gestão de Hotéis**: Cadastro e administração de hotéis
- **Gestão de Quartos**: Controle de disponibilidade e tipos
- **Gestão de Hóspedes**: Cadastro e histórico de clientes
- **Sistema de Reservas**: Processo completo de reservas
- **Autenticação**: Sistema seguro de login e autorização
- **Painel Administrativo**: Interface para gestão do sistema

### 📊 Estatísticas Avançadas
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

### Frontend (React)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)

### Backend (Node.js)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- **Banco**: SQLite3
- **Segurança**: Helmet, express-rate-limit
- **Performance**: Compression, cache em memória
- **Testes**: Jest + Supertest
- **Linting**: ESLint

## 📦 Instalação

### Pré-requisitos:
- [Node.js](https://nodejs.org/) instalado

### Rodando o Frontend

```bash
cd frontend
npm install
npm run dev
```

### Rodando o Backend

```bash
cd backend
npm install
npm start
```

## 🧪 Testes - backend

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

## 🧪 Testes - frontend
- Rode o backend
- Rode o frontend

```bash
# Navegar para o diretório frontend
cd frontend

# Executar testes Cucumber (BDD)
npm run test:cucumber

# Executar testes Playwright
npm run test:playwright

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

### 📋 Testes Cucumber (BDD)
Os testes Cucumber estão localizados em:
- **Features**: `features/room/usageScenarios.feature`
- **Steps**: `tests/steps/room-usage.steps.js`

### 🎭 Testes Playwright
Os testes Playwright estão localizados em:
- **Testes**: `tests/room-usage.spec.js`
- **Configuração**: `playwright.config.js`

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

### Docker no backend (Opcional)
```bash
docker-compose up
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

## 👥 Equipe 

- **ELLIAN DOS SANTOS RODRIGUES**
- **ROSEANE OLIVEIRA CAVALCANTE GAMA**
- **ISAAC FERREIRA SILVA**
- **JULIANO MATHEUS FERREIRA DA SILVA** *(Desenvolvedor das funcionalidades de Estatísticas)*
- **LETICIA RODRIGUES PEREIRA FERREIRA**

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
