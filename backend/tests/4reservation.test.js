import { expect, use } from 'chai';
import { default as chaiHttp, request } from 'chai-http';
import app from '../src/server.js';

use(chaiHttp);

describe('Reserva - Hospede faz uma reserva', () => {
  let server;
  let hospedeId;
  let hotelId;
  let roomId;

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

  it('Deve permitir que um hóspede já cadastrado faça uma reserva de um quarto', (done) => {
    // 1. Buscar hóspede já cadastrado (cpf: 12345678900)
    request.execute(server)
      .get('/api/hospedes')
      .end((err, res) => {
        expect(res).to.have.status(200);
        const hospede = res.body.find(h => h.cpf === '12345678900');
        expect(hospede).to.exist;
        hospedeId = hospede.id;
        // 2. Buscar hotel já cadastrado (cnpj: 12345678900000)
        request.execute(server)
          .get('/api/hotels')
          .end((err, res) => {
            expect(res).to.have.status(200);
            const hotel = res.body.find(h => h.cnpj === '12345678900000');
            expect(hotel).to.exist;
            hotelId = hotel.id;
            // 3. Cadastrar quarto
            const roomData = {
              identifier: 1,
              type: 'lodge',
              n_of_adults: 2,
              description: 'Quarto de teste',
              cost: 100,
              photos: ['foto1.png'],
              city: 'Recife',
              hotel_id: hotelId
            };
            request.execute(server)
              .post('/api/rooms')
              .send(roomData)
              .end((err, res) => {
                expect(res).to.have.status(201);
                roomId = res.body.id;
                // 4. Fazer reserva
                const reservationData = {
                  name: 'Reserva Teste',
                  start_date: '2024-07-01',
                  end_date: '2024-07-05',
                  room_id: roomId,
                  hospede_id: hospedeId
                };
                request.execute(server)
                  .post('/api/reservations')
                  .send(reservationData)
                  .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('name', 'Reserva Teste');
                    expect(res.body).to.have.property('start_date', '2024-07-01');
                    expect(res.body).to.have.property('end_date', '2024-07-05');
                    expect(res.body).to.have.property('room_id', roomId);
                    expect(res.body).to.have.property('hospede_id', hospedeId);
                    done();
                  });
              });
          });
      });
  });
}); 