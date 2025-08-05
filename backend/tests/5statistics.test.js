import { expect, use } from 'chai';
import { default as chaiHttp, request } from 'chai-http';
import app from '../src/server.js';

use(chaiHttp);

describe('Estatísticas - Testes de Integração', () => {
  let server;

  before((done) => {
    server = app.listen(0, done);
  });

  after((done) => {
    if (server && server.listening) {
      server.close(done);
    } else {
      done();
    }
  });

  describe('GET /api/statistics/overview', () => {
    it('deve retornar estatísticas gerais do sistema', async () => {
      const res = await request.execute(app)
        .get('/api/statistics/overview');
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.all.keys(
        'totalHotels', 'totalHospedes', 'totalRooms', 
        'totalReservations', 'activeReservations', 
        'totalRevenue', 'avgRoomPrice', 'occupancyRate'
      );
    });

    it('deve retornar números válidos nas estatísticas', async () => {
      const res = await request.execute(app)
        .get('/api/statistics/overview');
      
      expect(res.body.data.totalHotels).to.be.a('number');
      expect(res.body.data.totalHospedes).to.be.a('number');
      expect(res.body.data.totalRooms).to.be.a('number');
      expect(res.body.data.totalReservations).to.be.a('number');
      expect(res.body.data.totalRevenue).to.be.a('number');
    });
  });

  describe('GET /api/statistics/top-hotels', () => {
    it('deve retornar lista de hotéis ordenada por receita', async () => {
      const res = await request.execute(app)
        .get('/api/statistics/top-hotels');
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.be.an('array');
      
      if (res.body.data.length > 0) {
        expect(res.body.data[0]).to.have.all.keys(
          'id', 'hotel_name', 'total_rooms', 'total_reservations',
          'total_revenue', 'avg_room_price', 'occupancy_rate'
        );
      }
    });
  });

  describe('GET /api/statistics/by-room-type', () => {
    it('deve retornar estatísticas por tipo de quarto', async () => {
      const res = await request.execute(app)
        .get('/api/statistics/by-room-type');
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.be.an('array');
      
      if (res.body.data.length > 0) {
        expect(res.body.data[0]).to.have.all.keys(
          'room_type', 'total_rooms', 'active_reservations',
          'occupancy_rate', 'avg_price', 'total_revenue', 'avg_capacity'
        );
      }
    });
  });

  describe('GET /api/statistics/trends', () => {
    it('deve retornar dados de tendências mensais', async () => {
      const res = await request.execute(app)
        .get('/api/statistics/trends');
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.be.an('array');
      
      if (res.body.data.length > 0) {
        expect(res.body.data[0]).to.have.all.keys(
          'month', 'reservations', 'revenue', 'new_customers',
          'avg_price', 'growth_rate'
        );
      }
    });
  });

  describe('GET /api/statistics/all', () => {
    it('deve retornar todas as estatísticas agregadas', async () => {
      const res = await request.execute(app)
        .get('/api/statistics/all');
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.all.keys(
        'overview', 'monthStats', 'topHotels', 'roomTypeStats',
        'seasonStats', 'advancedMetrics', 'trends'
      );
    });
  });

  describe('GET /api/statistics/health', () => {
    it('deve retornar status de saúde das estatísticas', async () => {
      const res = await request.execute(app)
        .get('/api/statistics/health');
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('status', 'healthy');
      expect(res.body).to.have.property('service');
    });
  });

  describe('DELETE /api/statistics/cache', () => {
    it('deve limpar o cache com sucesso', async () => {
      const res = await request.execute(app)
        .delete('/api/statistics/cache');
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('message').that.includes('Cache limpo com sucesso');
    });
  });
});
