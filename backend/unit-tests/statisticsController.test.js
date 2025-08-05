import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import express from 'express';

// Create a test app
const app = express();
app.use(express.json());

// Import and use the statistics router
import statisticsRouter from '../src/routes/statisticsRouter.js';
import * as statisticsController from '../src/controllers/statisticsController.js';
import Statistics from '../src/models/statistics.js';

app.use('/api/statistics', statisticsRouter);

describe('Statistics Controller Unit Tests', () => {
  let server;
  let statisticsStub;

  before(() => {
    server = app.listen(0);
  });

  after(() => {
    server.close();
  });

  beforeEach(() => {
    // Create stubs for Statistics model methods
    statisticsStub = {
      getOverview: sinon.stub(Statistics, 'getOverview'),
      getTopHotels: sinon.stub(Statistics, 'getTopHotels'),
      getByRoomType: sinon.stub(Statistics, 'getByRoomType'),
      getTrends: sinon.stub(Statistics, 'getTrends'),
      getByMonth: sinon.stub(Statistics, 'getByMonth'),
      getBySeason: sinon.stub(Statistics, 'getBySeason'),
      getAdvancedMetrics: sinon.stub(Statistics, 'getAdvancedMetrics')
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getOverviewStats', () => {
    it('deve retornar dados de overview com sucesso', async () => {
      const mockOverview = {
        totalHotels: 3,
        totalHospedes: 2,
        totalRooms: 5,
        totalReservations: 3,
        activeReservations: 1,
        totalRevenue: 450,
        avgRoomPrice: 420,
        occupancyRate: 0
      };

      statisticsStub.getOverview.resolves(mockOverview);

      const res = await request(app)
        .get('/api/statistics/overview');

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.deep.equal(mockOverview);
      expect(statisticsStub.getOverview.calledOnce).to.be.true;
    });

    it('deve tratar erros do modelo corretamente', async () => {
      statisticsStub.getOverview.rejects(new Error('Database error'));

      const res = await request(app)
        .get('/api/statistics/overview');

      expect(res.status).to.equal(500);
      expect(res.body.success).to.be.false;
      expect(res.body).to.have.property('error');
    });
  });

  describe('getTopHotels', () => {
    it('deve retornar lista de hotéis ordenada', async () => {
      const mockHotels = [
        {
          id: 4,
          hotel_name: 'Hotel Unique',
          total_rooms: 2,
          total_reservations: 0,
          total_revenue: 800,
          avg_room_price: 400,
          occupancy_rate: 0
        },
        {
          id: 2,
          hotel_name: 'Hotel Copacabana Palace',
          total_rooms: 2,
          total_reservations: 1,
          total_revenue: 700,
          avg_room_price: 350,
          occupancy_rate: 50
        }
      ];

      statisticsStub.getTopHotels.resolves(mockHotels);

      const res = await request(app)
        .get('/api/statistics/top-hotels');

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.deep.equal(mockHotels);
    });
  });

  describe('getStatsByRoomType', () => {
    it('deve retornar estatísticas por tipo de quarto', async () => {
      const mockRoomTypes = [
        {
          room_type: 'lodge',
          total_rooms: 3,
          active_reservations: 0,
          occupancy_rate: 0,
          avg_price: 523.33,
          total_revenue: 1570,
          avg_capacity: 3.33
        }
      ];

      statisticsStub.getByRoomType.resolves(mockRoomTypes);

      const res = await request(app)
        .get('/api/statistics/by-room-type');

      expect(res.status).to.equal(200);
      expect(res.body.data).to.deep.equal(mockRoomTypes);
    });
  });

  describe('Cache functionality', () => {
    it('deve limpar cache com sucesso', async () => {
      const res = await request(app)
        .delete('/api/statistics/cache');

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body).to.have.property('message');
    });

    it('deve usar cache em requisições subsequentes', async () => {
      const mockOverview = { totalHotels: 3 };
      statisticsStub.getOverview.resolves(mockOverview);

      // Primeira requisição
      await request(app).get('/api/statistics/overview');
      
      // Segunda requisição
      const res = await request(app).get('/api/statistics/overview');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('cache');
    });
  });

  describe('Health check', () => {
    it('deve retornar status de saúde', async () => {
      const res = await request(app)
        .get('/api/statistics/health');

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('status');
      expect(res.body.data).to.have.property('timestamp');
    });
  });

  describe('Error handling', () => {
    it('deve tratar erros de conexão com banco', async () => {
      statisticsStub.getOverview.rejects(new Error('SQLITE_BUSY'));

      const res = await request(app)
        .get('/api/statistics/overview');

      expect(res.status).to.equal(500);
      expect(res.body.success).to.be.false;
    });

    it('deve tratar timeout de consultas', async () => {
      statisticsStub.getTopHotels.rejects(new Error('Query timeout'));

      const res = await request(app)
        .get('/api/statistics/top-hotels');

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property('error');
    });
  });
});
