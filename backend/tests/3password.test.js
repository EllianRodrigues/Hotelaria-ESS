const chai = require('chai');
chai.use(require('chai-http'));
const expect = chai.expect;
const app = require('../src/server');

describe('Testes de Edição de Senha - Baseado no registrerLoginEdit.feature', () => {
  let server;
  let clienteId;
  let hotelId;

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

  beforeEach((done) => {
    // Buscar o cliente que já foi criado no register.test.js
    chai.request(server)
      .get('/api/hospedes')
      .end((err, res) => {
        // Encontrar o cliente com CPF 12345678900
        const cliente = res.body.find(h => h.cpf === '12345678900');
        clienteId = cliente ? cliente.id : null;
        
        // Buscar o hotel que já foi criado no register.test.js
        chai.request(server)
          .get('/api/hotels')
          .end((err, res) => {
            // Encontrar o hotel com CNPJ 12345678900000
            const hotel = res.body.find(h => h.cnpj === '12345678900000');
            hotelId = hotel ? hotel.id : null;
            done();
          });
      });
  });

  describe('Hospede - Edição de Senha', () => {
    it('Deve editar senha do cliente com sucesso', (done) => {
      chai.request(server)
        .put(`/api/hospedes/${clienteId}/password`)
        .send({
          currentPassword: "123",
          newPassword: "456",
          loggedInCpf: "12345678900"
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Senha do hóspede atualizada com sucesso!');
          done();
        });
    });

    it('Deve falhar ao editar senha com senha atual incorreta', (done) => {
      chai.request(server)
        .put(`/api/hospedes/${clienteId}/password`)
        .send({
          currentPassword: "senhaErrada",
          newPassword: "456",
          loggedInCpf: "12345678900"
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error', 'Senha atual incorreta');
          done();
        });
    });

    it('Deve falhar ao editar senha com campos obrigatórios em branco', (done) => {
      chai.request(server)
        .put(`/api/hospedes/${clienteId}/password`)
        .send({
          currentPassword: "",
          newPassword: "456",
          loggedInCpf: "12345678900"
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('Hotel - Edição de Senha', () => {
    it('Deve editar senha do hotel com sucesso', (done) => {
      chai.request(server)
        .put(`/api/hotels/${hotelId}/password`)
        .send({
          currentPassword: "123",
          newPassword: "456",
          loggedInCnpj: "12345678900000"
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Senha do hotel atualizada com sucesso!');
          done();
        });
    });

    it('Deve falhar ao editar senha com senha atual incorreta', (done) => {
      chai.request(server)
        .put(`/api/hotels/${hotelId}/password`)
        .send({
          currentPassword: "senhaErrada",
          newPassword: "456",
          loggedInCnpj: "12345678900000"
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error', 'Senha atual incorreta');
          done();
        });
    });

    it('Deve falhar ao editar senha com campos obrigatórios em branco', (done) => {
      chai.request(server)
        .put(`/api/hotels/${hotelId}/password`)
        .send({
          currentPassword: "",
          newPassword: "456",
          loggedInCnpj: "12345678900000"
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });
}); 