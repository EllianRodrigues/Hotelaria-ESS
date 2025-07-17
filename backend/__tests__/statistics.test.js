// Feito por Juliano Matheus Ferreira

const request = require('supertest');
const express = require('express');
const Estatisticas = require('../models/StatisticsModel');

// Mock do banco de dados para testes
jest.mock('../database/database', () => ({
  get: jest.fn(),
  all: jest.fn()
}));

// Criar app de teste com todas as rotas
const app = require('../server');

describe('API de Estatísticas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/estatisticas/resumo', () => {
    it('deve retornar resumo geral', async () => {
      const dadosMock = {
        hospedes: 8,
        hoteis: 5,
        quartos: 16,
        quartosDisponiveis: 13,
        reservas: 10,
        taxaOcupacao: 18.75,
        receita: 10860,
        mediaNoites: 2.4
      };

      // Mock do banco
      const db = require('../database/database');
      db.get.mockImplementation((query, callback) => {
        if (query.includes('hospedes')) {
          callback(null, { total: 8 });
        } else if (query.includes('hotels')) {
          callback(null, { total: 5 });
        } else if (query.includes('rooms') && query.includes('is_available')) {
          callback(null, { total: 13 });
        } else if (query.includes('rooms')) {
          callback(null, { total: 16 });
        } else if (query.includes('reservations') && query.includes('COUNT')) {
          callback(null, { total: 10 });
        } else if (query.includes('SUM')) {
          callback(null, { total: 10860 });
        } else if (query.includes('AVG')) {
          callback(null, { media: 2.4 });
        }
      });

      const response = await request(app)
        .get('/api/estatisticas/resumo')
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.mensagem).toBe('Resumo geral');
      expect(response.body.dados).toHaveProperty('hospedes');
    });
  });

  describe('GET /health', () => {
    it('deve retornar status de saúde da API', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('Cache', () => {
    it('deve limpar cache corretamente', async () => {
      const response = await request(app)
        .post('/api/estatisticas/limpar-cache')
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.mensagem).toBe('Cache limpo com sucesso');
    });
  });
});

describe('Modelo de Estatísticas', () => {
  beforeEach(() => {
    Estatisticas.limparCache();
  });

  it('deve implementar cache corretamente', () => {
    const chave = Estatisticas.gerarChaveCache('teste');
    expect(chave).toBe('teste_');
    
    Estatisticas.salvarCache(chave, { dados: 'teste' });
    const cacheado = Estatisticas.buscarCache(chave);
    expect(cacheado).toEqual({ dados: 'teste' });
  });
}); 