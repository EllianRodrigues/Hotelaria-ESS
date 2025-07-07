import { expect, use } from "chai"; // Import 'expect' and 'use' directly
import {default as chaiHttp, request} from "chai-http";
import Hotel from '../../src/models/hotel.js';
import Room from '../../src/models/room.js';
import db from '../../src/sqlite/db.js';
import app from '../../src/server.js';
use(chaiHttp);
// Mock para evitar crash caso app exporte apenas a função listen
const server = typeof app === 'function' && app.listen ? app : { close: () => { } };

describe('Room Service BDD', function () {
  let hotelId;

  beforeEach(async function () {
    await new Promise((resolve, reject) => db.run('DELETE FROM rooms', err => err ? reject(err) : resolve()));
    await new Promise((resolve, reject) => db.run('DELETE FROM hotels', err => err ? reject(err) : resolve()));
    const hotel = await Hotel.create('Hotel Recife', 'Recife');
    hotelId = hotel.id;
    await Room.create({
      identifier: 101,
      type: 'lodge',
      n_of_adults: 2,
      description: 'Quarto confortável',
      cost: 200,
      photos: ['quarto1.png'],
      hotel_id: hotelId
    });
  });

  after(function (done) {
    if (server && server.close) server.close();
    done();
  });

  describe('Scenario: Successful hotel room search', function () {
    it('deve retornar 200 e uma lista de quartos disponíveis', async function () {
      try {
        const allRooms = await new Promise((resolve, reject) => {
          db.all('SELECT * FROM rooms', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          });
        });
        const allHotels = await new Promise((resolve, reject) => {
          db.all('SELECT * FROM hotels', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          });
        });
        console.log('Current rooms in DB:', allRooms);
        const res = await request.execute(app)
          .get('/api/rooms')
          .query({ city: 'Recife', n_of_adults: '2', start_date: '2025-05-01', end_date: '2025-06-10', available: 'true' });
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
      } catch (err) {
        throw new Error('Erro no teste de busca de quartos disponíveis: ' + err.message);
      }
    });
  });

  describe('Scenario: Incomplete hotel room search', function () {
    it('deve retornar 400 e mensagem de erro para busca incompleta', async function () {
      try {
        const res = await request.execute(app)
          .get('/api/rooms')
          .query({ city: 'Recife', start_date: '2025-05-01', end_date: '2025-06-10', available: 'true' });
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').that.includes('Incomplete information');
      } catch (err) {
        throw new Error('Erro no teste de busca incompleta: ' + err.message);
      }
    });
  });

  describe('Scenario: Successful publishing of a hotel room', function () {
    it('deve criar um quarto e retornar 201 com identificador e tipo', async function () {
      try {
        const res = await request.execute(app)
          .post('/api/rooms')
          .send({
            type: 'lodge',
            n_of_adults: 2,
            cost: 100.00,
            photos: ['example.png'],
            identifier: '30',
            hotel_id: hotelId
          });
        expect(res).to.have.status(201);
        expect(res.body).to.include({ identifier: '30', type: 'lodge' });
      } catch (err) {
        throw new Error('Erro no teste de criação de quarto: ' + err.message);
      }
    });
  });

  describe('Scenario: Unsuccessful publishing of a hotel room', function () {
    it('deve retornar 400 e mensagem de erro para criação incompleta', async function () {
      try {
        const res = await request.execute(app)
          .post('/api/rooms')
          .send({
            type: 'lodge',
            n_of_adults: 2,
            cost: 100.00,
            photos: ['example.png'],
            hotel_id: hotelId
          }); // sem identifier
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').that.includes('Incomplete information');
      } catch (err) {
        throw new Error('Erro no teste de criação incompleta: ' + err.message);
      }
    });
  });

  describe('Scenario: Get room by id', function () {
    it('deve retornar o quarto correto pelo id composto', async function () {
      try {
        const res = await request.execute(app)
          .get(`/api/rooms/lodge-101`)
          .query({ hotel_id: hotelId });
        expect(res).to.have.status(200);
        expect(res.body).to.include({ identifier: 101, type: 'lodge', hotel_id: hotelId });
      } catch (err) {
        throw new Error('Erro no teste de busca por id: ' + err.message);
      }
    });
  });

  describe('Scenario: Get all rooms from a certain hotel', function () {
    it('deve retornar todos os quartos do hotel', async function () {
      try {
        const res = await request.execute(app)
          .get('/api/rooms')
          .query({ hotel_id: hotelId });
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.greaterThan(0);
        expect(res.body[0]).to.include({ hotel_id: hotelId });
      } catch (err) {
        throw new Error('Erro no teste de busca de quartos do hotel: ' + err.message);
      }
    });
  });
}); 