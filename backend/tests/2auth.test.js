const chai = require('chai');
chai.use(require('chai-http'));
const expect = chai.expect;
const app = require('../src/server');

describe('Testes de Autenticação', () => {
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

  describe('Hospede - Login', () => {
    it('Deve fazer login de cliente com sucesso', (done) => {
      // Usar o cliente que já foi criado no register.test.js
      chai.request(server)
        .post('/api/auth/hospede/login')
        .send({
          cpf: "12345678900", // CPF do cliente criado no register.test.js
          senha: "123"
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.have.property('nome', 'Ellian');
          expect(res.body.user).to.have.property('cpf', '12345678900');
          expect(res.body.user).to.have.property('tipo', 'hospede');
          done();
        });
    });

    it('Deve falhar no login com CPF ou senha incorretos', (done) => {
      chai.request(server)
        .post('/api/auth/hospede/login')
        .send({
          cpf: "12345678900", // CPF existente
          senha: "senhaErrada"
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('Deve falhar no login com CPF inexistente', (done) => {
      chai.request(server)
        .post('/api/auth/hospede/login')
        .send({
          cpf: "99999999999",
          senha: "123"
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('Hotel - Login', () => {
    it('Deve fazer login de hotel com sucesso', (done) => {
      // Usar o hotel que já foi criado no register.test.js
      chai.request(server)
        .post('/api/auth/hotel/login')
        .send({
          cnpj: "12345678900000", // CNPJ do hotel criado no register.test.js
          senha: "123"
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.have.property('nome', 'Paradise');
          expect(res.body.user).to.have.property('cnpj', '12345678900000');
          expect(res.body.user).to.have.property('tipo', 'hotel');
          done();
        });
    });

    it('Deve falhar no login com CNPJ ou senha incorretos', (done) => {
      chai.request(server)
        .post('/api/auth/hotel/login')
        .send({
          cnpj: "12345678900000", // CNPJ existente
          senha: "senhaErrada"
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('Deve falhar no login com CNPJ inexistente', (done) => {
      chai.request(server)
        .post('/api/auth/hotel/login')
        .send({
          cnpj: "99999999999999",
          senha: "123"
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });
}); 