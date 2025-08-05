import { expect, use } from "chai"; // Import 'expect' and 'use' directly
import {default as chaiHttp, request} from "chai-http";
import Hotel from '../src/models/hotel.js';
import Room from '../src/models/room.js';
import db from '../src/sqlite/db.js';
import app from '../src/server.js';
import fs from 'fs';
import path from 'path';
use(chaiHttp);
const server = typeof app === 'function' && app.listen ? app : { close: () => { } };

//PARA LINUX
// function extractFeatureData() {
//   const featurePath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'features', 'room', 'serviceScenarios.feature');
//   const featureContent = fs.readFileSync(featurePath, 'utf8');


//PARA WINDOWS
function extractFeatureData() {
  let dirPath = path.dirname(new URL(import.meta.url).pathname);
  // Corrigir para Windows: remover barra inicial se existir
  if (process.platform === 'win32' && dirPath.startsWith('/')) {
    dirPath = dirPath.slice(1);
  }
  const featurePath = path.resolve(
    dirPath,
    '..', '..', 'features', 'room', 'serviceScenarios.feature'
  );
  const normalizedPath = process.platform === 'win32' ? path.win32.normalize(featurePath) : featurePath;
  const featureContent = fs.readFileSync(normalizedPath, 'utf8');
//
  
  const data = {};
  
  // Extract data from "Successful hotel room search" scenario
  const searchMatch = featureContent.match(/Given that available hotel rooms exist in the system for city "([^"]+)" that accommodate "([^"]+)" adults during the period from "([^"]+)" to "([^"]+)".*?success response with the code "([^"]+)"/s);
  if (searchMatch) {
    data.successfulSearch = {
      given: {
        city: searchMatch[1],
        n_of_adults: searchMatch[2],
        start_date: searchMatch[3],
        end_date: searchMatch[4]
      },
      expectedStatus: searchMatch[5]
    };
  }
  
  // Extract data from "Incomplete hotel room search" scenario
  const incompleteMatch = featureContent.match(/Given that the system has hotel rooms available for city "([^"]+)" and period "([^"]+)" to "([^"]+)".*?error response with the code "([^"]+)".*?error message states "([^"]+)"/s);
  if (incompleteMatch) {
    data.incompleteSearch = {
      given: {
        city: incompleteMatch[1],
        start_date: incompleteMatch[2],
        end_date: incompleteMatch[3]
      },
      expectedStatus: incompleteMatch[4],
      expectedError: incompleteMatch[5]
    };
  }
  
  // Extract data from "Successful publishing of a hotel room" scenario
  const successfulPublishMatch = featureContent.match(/Given that there is no hotel room with identifier "([^"]+)" under type "([^"]+)" in the system for the hotel with ID "([^"]+)".*?type "([^"]+)".*?"n_of_adults" "([^"]+)".*?"cost" "([^"]+)".*?"photos" \[([^\]]+)\].*?"identifier" "([^"]+)".*?hotel_id "([^"]+)".*?success response with the code "([^"]+)".*?room identifier "([^"]+)" and the type "([^"]+)"/s);
  if (successfulPublishMatch) {
    data.successfulPublish = {
      given: {
        noRoomWithIdentifier: successfulPublishMatch[1],
        noRoomWithType: successfulPublishMatch[2],
        hotelId: successfulPublishMatch[3]
      },
      identifier: successfulPublishMatch[8],
      type: successfulPublishMatch[4],
      n_of_adults: successfulPublishMatch[5],
      cost: successfulPublishMatch[6],
      photos: successfulPublishMatch[7].replace(/"/g, '').split(','),
      hotel_id: successfulPublishMatch[9],
      expectedStatus: successfulPublishMatch[10],
      expectedIdentifier: successfulPublishMatch[11],
      expectedType: successfulPublishMatch[12]
    };
  }
  
  // Extract data from "Unsuccessful publishing of a hotel room" scenario
  const unsuccessfulPublishMatch = featureContent.match(/Given that the system has a hotel with ID "([^"]+)".*?"([^"]+)".*?"n_of_adults" "([^"]+)".*?"cost" "([^"]+)".*?"photos" \[([^\]]+)\].*?hotel_id "([^"]+)".*?error response with the code "([^"]+)".*?error message states "([^"]+)"/s);
  if (unsuccessfulPublishMatch) {
    data.unsuccessfulPublish = {
      given: {
        hotelId: unsuccessfulPublishMatch[1]
      },
      type: unsuccessfulPublishMatch[2],
      n_of_adults: unsuccessfulPublishMatch[3],
      cost: unsuccessfulPublishMatch[4],
      photos: unsuccessfulPublishMatch[5].replace(/"/g, '').split(','),
      hotel_id: unsuccessfulPublishMatch[6],
      expectedStatus: unsuccessfulPublishMatch[7],
      expectedError: unsuccessfulPublishMatch[8]
    };
  }
  
  return data;
}

async function createTestHotel(name, city) {
  const email = `random${Math.floor(Math.random() * 1000000)}@test.com`;
  const cnpj = Math.floor(Math.random() * 90000000000000) + 10000000000000;
  const password = 'test123';
  
  return await Hotel.create(name, email, cnpj.toString(), password);
}

describe('Room Service BDD', function () {
  let hotelId;
  let featureData;

  before(function() {
    featureData = extractFeatureData();
  });

  beforeEach(async function () {
    await new Promise((resolve, reject) => db.run('DELETE FROM rooms', err => err ? reject(err) : resolve()));
    await new Promise((resolve, reject) => db.run('DELETE FROM hotels', err => err ? reject(err) : resolve()));
    const hotel = await createTestHotel('Hotel Recife', 'Recife');
    hotelId = hotel.id;
    await Room.create({
      identifier: 101,
      type: 'lodge',
      n_of_adults: 2,
      description: 'Quarto confortável',
      cost: 200,
      photos: ['quarto1.png'],
      city: 'Recife',
      hotel_id: hotelId
    });
  });

  after(function (done) {
    if (server && server.close) server.close();
    done();
  });

  describe('Scenario: Successful hotel room search', function () {
    beforeEach(async function () {
      // Given: available hotel rooms exist in the system for city "Recife" that accommodate "2" adults
      const hotel = await createTestHotel('Hotel Recife', featureData.successfulSearch.given.city);
      await Room.create({
        identifier: 101,
        type: 'lodge',
        n_of_adults: parseInt(featureData.successfulSearch.given.n_of_adults),
        description: 'Quarto confortável',
        cost: 200,
        photos: ['quarto1.png'],
        city: featureData.successfulSearch.given.city,
        hotel_id: hotel.id
      });
    });

    it('deve retornar 200 e uma lista de quartos disponíveis', async function () {
      try {
        const res = await request.execute(app)
          .get('/api/rooms')
          .query({ 
            city: featureData.successfulSearch.given.city, 
            n_of_adults: featureData.successfulSearch.given.n_of_adults, 
            start_date: featureData.successfulSearch.given.start_date, 
            end_date: featureData.successfulSearch.given.end_date, 
            available: 'true' 
          });
        expect(res).to.have.status(parseInt(featureData.successfulSearch.expectedStatus));
        expect(res.body).to.be.an('array');
      } catch (err) {
        throw new Error('Erro no teste de busca de quartos disponíveis: ' + err.message);
      }
    });
  });

  describe('Scenario: Incomplete hotel room search', function () {
    beforeEach(async function () {
      // Given: the system has hotel rooms available for city "Recife" and period "2025-05-01" to "2025-06-10"
      const hotel = await createTestHotel('Hotel Recife', featureData.incompleteSearch.given.city);
      await Room.create({
        identifier: 101,
        type: 'lodge',
        n_of_adults: 2,
        description: 'Quarto confortável',
        cost: 200,
        photos: ['quarto1.png'],
        city: featureData.incompleteSearch.given.city,
        hotel_id: hotel.id
      });
    });

    it('deve retornar 400 e mensagem de erro para busca incompleta', async function () {
      try {
        const res = await request.execute(app)
          .get('/api/rooms')
          .query({ 
            city: featureData.incompleteSearch.given.city, 
            start_date: featureData.incompleteSearch.given.start_date, 
            end_date: featureData.incompleteSearch.given.end_date, 
            available: 'true' 
          });
        expect(res).to.have.status(parseInt(featureData.incompleteSearch.expectedStatus));
        expect(res.body).to.have.property('error').that.includes(featureData.incompleteSearch.expectedError);
      } catch (err) {
        throw new Error('Erro no teste de busca incompleta: ' + err.message);
      }
    });
  });

  describe('Scenario: Successful publishing of a hotel room', function () {
    beforeEach(async function () {
      // Given: there is no hotel room with identifier "30" under type "lodge" in the system for the hotel with ID "1"
      // Create hotel with ID 1 (or ensure it exists)
      const hotel = await createTestHotel('Hotel Test', 'Test City');
      // Ensure no room with the specified identifier exists
      await new Promise((resolve, reject) => db.run('DELETE FROM rooms WHERE identifier = ? AND type = ? AND hotel_id = ?', 
        [featureData.successfulPublish.given.noRoomWithIdentifier, featureData.successfulPublish.given.noRoomWithType, parseInt(featureData.successfulPublish.given.hotelId)], 
        err => err ? reject(err) : resolve()));
    });

    it('deve criar um quarto e retornar 201 com identificador e tipo', async function () {
      try {
        const res = await request.execute(app)
          .post('/api/rooms')
          .send({
            type: featureData.successfulPublish.type,
            n_of_adults: featureData.successfulPublish.n_of_adults,
            cost: parseFloat(featureData.successfulPublish.cost),
            photos: featureData.successfulPublish.photos,
            identifier: featureData.successfulPublish.identifier,
            city: 'Test City',
            hotel_id: parseInt(featureData.successfulPublish.hotel_id)
          });
        expect(res).to.have.status(parseInt(featureData.successfulPublish.expectedStatus));
        expect(res.body).to.include({ 
          identifier: featureData.successfulPublish.expectedIdentifier, 
          type: featureData.successfulPublish.expectedType 
        });
      } catch (err) {
        throw new Error('Erro no teste de criação de quarto: ' + err.message);
      }
    });
  });

  describe('Scenario: Unsuccessful publishing of a hotel room', function () {
    beforeEach(async function () {
      // Given: the system has a hotel with ID "1"
      // Ensure hotel with ID 1 exists
      await createTestHotel('Hotel Test', 'Test City');
    });

    it('deve retornar 400 e mensagem de erro para criação incompleta', async function () {
      try {
        const res = await request.execute(app)
          .post('/api/rooms')
          .send({
            type: featureData.unsuccessfulPublish.type,
            n_of_adults: featureData.unsuccessfulPublish.n_of_adults,
            cost: parseFloat(featureData.unsuccessfulPublish.cost),
            photos: featureData.unsuccessfulPublish.photos,
            city: 'Test City',
            hotel_id: parseInt(featureData.unsuccessfulPublish.hotel_id)
          });
        expect(res).to.have.status(parseInt(featureData.unsuccessfulPublish.expectedStatus));
        expect(res.body).to.have.property('error').that.includes(featureData.unsuccessfulPublish.expectedError);
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


  describe('Room duplicate creation', function() {
    it('deve retornar erro 409 ao tentar criar um quarto já existente', async function() {
      try {
        const res1 = await request.execute(app)
          .post('/api/rooms')
          .send({
            identifier: 102,
            type: 'lodge',
            n_of_adults: 2,
            description: 'Quarto confortável',
            cost: 200,
            photos: ['quarto1.png'],
            city: 'Recife',
            hotel_id: hotelId
          });
        expect(res1).to.have.status(201);

        const res2 = await request.execute(app)
          .post('/api/rooms')
          .send({
            identifier: 102,
            type: 'lodge',
            n_of_adults: 2,
            description: 'Quarto confortável',
            cost: 200,
            photos: ['quarto1.png'],
            city: 'Recife',
            hotel_id: hotelId
          });
        expect(res2).to.have.status(409);
        expect(res2.body).to.have.property('error').that.includes('Room with same identifier, type, and hotel_id already exists');
      } catch (err) {
        throw new Error('Erro no teste de room duplicado: ' + err.message);
      }
    });
  });
}); 