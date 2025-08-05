import { expect, use } from 'chai';
import { default as chaiHttp, request } from "chai-http"; // Importação corrigida
import app from '../src/server.js';
import db from '../src/sqlite/db.js';

use(chaiHttp);

describe('Testes de Admin e Conflitos de Cadastro', () => {
    let server;
    let testHotelId;
    let testHospedeId;

    // Hook para iniciar o servidor e limpar o banco de dados antes de todos os testes
    before((done) => {
        server = app.listen(0, () => {
            db.serialize(() => {
                // Limpa as tabelas para garantir um ambiente de teste limpo
                db.run('DELETE FROM hospede');
                db.run('DELETE FROM hotels');
                db.run('DELETE FROM reservations');
                db.run('DELETE FROM rooms');
                db.run('DELETE FROM admins');

                // Cria um admin para os testes de funcionalidade
                db.run('INSERT INTO admins (nome, email, senha) VALUES (?, ?, ?)',
                    ['Admin User', 'admin@test.com', 'admin123']);

                // Cria um usuário para teste de conflito
                db.run('INSERT INTO hospede (nome, email, cpf, senha) VALUES (?, ?, ?, ?)',
                    ['Hospede Existente', 'hospede.existente@test.com', '11122233344', 'senha123'], function(err) {
                        if (err) return done(err);
                        testHospedeId = this.lastID;
                        // Cria um hotel para teste de conflito e guarda seu ID
                        db.run('INSERT INTO hotels (nome, email, cnpj, senha) VALUES (?, ?, ?, ?)',
                            ['Hotel Existente', 'hotel.existente@test.com', '11222333000144', 'senha123'], function(err) {
                                if (err) return done(err);
                                testHotelId = this.lastID; // Guarda o ID do hotel para usar depois
                                done();
                            });
                    });
            });
        });
    });

    // Hook para fechar o servidor após todos os testes
    after((done) => {
        if (server && server.listening) {
            server.close(done);
        } else {
            done();
        }
    });

    describe('Cenários de Conflito de Cadastro', () => {
        it('Deve retornar erro 409 ao tentar cadastrar um Hóspede com CPF duplicado', (done) => {
            request.execute(server) // Uso corrigido do request
                .post('/api/hospedes')
                .send({ nome: 'Novo Hospede', email: 'novo@test.com', cpf: '11122233344', senha: '123' })
                .end((err, res) => {
                    expect(res).to.have.status(409);
                    expect(res.body).to.have.property('error').that.is.a('string');
                    done();
                });
        });

        it('Deve retornar erro 409 ao tentar cadastrar um Hotel com CNPJ duplicado', (done) => {
            request.execute(server) // Uso corrigido do request
                .post('/api/hotels')
                .send({ nome: 'Novo Hotel', email: 'novohotel@test.com', cnpj: '11222333000144', senha: '123' })
                .end((err, res) => {
                    expect(res).to.have.status(409);
                    expect(res.body).to.have.property('error').that.is.a('string');
                    done();
                });
        });
    });

    describe('Funcionalidades do Admin', () => {
        // Simula o login do admin antes dos testes de funcionalidade
        before((done) => {
            request.execute(server) 
                .post('/api/admin/login')
                .send({ email: 'admin@test.com', senha: 'admin123' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    
                    done();
                });
        });

        it('Admin deve conseguir listar todos os usuários (hóspedes e hotéis)', (done) => {
            request.execute(server) 
                .get('/api/admin/users')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.be.at.least(2); // Pelo menos 1 hóspede e 1 hotel
                    done();
                });
        });

        it('Admin deve conseguir listar todas as reservas', (done) => {
            // Cria um quarto e uma reserva para o teste
            db.run('INSERT INTO rooms (identifier, type, n_of_adults, cost, city, hotel_id) VALUES (101, "lodge", 2, 200, "Recife", ?)', [testHotelId], function(err) {
                if (err) return done(err);
                const roomId = this.lastID;
                db.run('INSERT INTO reservations (name, start_date, end_date, room_id, hospede_id) VALUES ("Reserva Teste", "2025-10-10", "2025-10-15", ?, ?)', [roomId, testHospedeId], (err) => {
                     if (err) return done(err);
                     request.execute(server) // Uso corrigido do request
                        .get('/api/admin/reservations')
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.an('array');
                            expect(res.body.length).to.be.at.least(1);
                            done();
                        });
                });
            });
        });
    });
});
