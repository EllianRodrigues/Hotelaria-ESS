import { expect, use } from 'chai';
import {default as chaiHttp, request} from "chai-http";
import app from '../src/server.js';

use(chaiHttp);

describe('Testes de Cadastro', () => {
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

  describe('Hospede - Cadastro', () => {
    it('Deve cadastrar Hospede com sucesso', (done) => {
      const clienteData = {
        nome: "Ellian",
        email: "ellian@gmail.com",
        senha: "123",
        cpf: "12345678900"
      };

      request.execute(server)
        .post('/api/hospedes')
        .send(clienteData)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('nome', 'Ellian');
          expect(res.body).to.have.property('email', 'ellian@gmail.com');
          expect(res.body).to.have.property('cpf', '12345678900');
          expect(res.body).to.not.have.property('senha'); // Senha não deve ser retornada
          done();
        });
    });

    it('Deve falhar no cadastro com campos obrigatórios em branco', (done) => {
      const clienteData = {
        nome: "Ellian",
        email: "ellian.register2@gmail.com",
        senha: "123",
        cpf: "" // CPF em branco
      };

      request.execute(server)
        .post('/api/hospedes')
        .send(clienteData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error', 'Todos os campos são obrigatórios.');
          done();
        });
    });

    it('Deve falhar no cadastro com CPF já existente', (done) => {
      // Usar o CPF que já foi criado no teste anterior
      const clienteData = {
        nome: "Outro Cliente",
        email: "novoemail.register@gmail.com",
        senha: "456",
        cpf: "12345678900" // CPF já existente do teste anterior
      };

      request.execute(server)
        .post('/api/hospedes')
        .send(clienteData)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('Hotel - Cadastro', () => {
    it('Deve cadastrar hotel com sucesso', (done) => {
      const hotelData = {
        nome: "Paradise",
        email: "paradise@gmail.com",
        senha: "123",
        cnpj: "12345678900000"
      };

      request.execute(server)
        .post('/api/hotels')
        .send(hotelData)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('nome', 'Paradise');
          expect(res.body).to.have.property('email', 'paradise@gmail.com');
          expect(res.body).to.have.property('cnpj', '12345678900000');
          expect(res.body).to.not.have.property('senha'); // Senha não deve ser retornada
          done();
        });
    });

    it('Deve falhar no cadastro com campos obrigatórios em branco', (done) => {
      const hotelData = {
        nome: "Paradise",
        email: "paradise.register2@gmail.com",
        senha: "123",
        cnpj: "" // CNPJ em branco
      };

      request.execute(server)
        .post('/api/hotels')
        .send(hotelData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('Deve falhar no cadastro com CNPJ já existente', (done) => {
      // Usar o CNPJ que já foi criado no teste anterior
      const hotelData = {
        nome: "Outro Hotel",
        email: "novohotel.register@gmail.com",
        senha: "456",
        cnpj: "12345678900000" // CNPJ já existente do teste anterior
      };

      request.execute(server)
        .post('/api/hotels')
        .send(hotelData)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });
});