
const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const { expect } = require('chai');
const server = require('../../index');

let clientId, reservaResponse;

Given('o cliente está autenticado no sistema', async function () {
  const res = await request(server)
    .post('/api/hospedes')
    .send({ name: 'Cliente Teste', cpf: '12345678901' });

  clientId = res.body.id;
});

When('o cliente tenta criar uma reserva', async function () {
});

When('o sistema calcula o valor da reserva', async function () {
  reservaResponse = await request(server)
    .post('/api/reservas')
    .send({
      hospede_id: clientId,
      quarto_id: 1,
      start_date: '2024-01-15',
      end_date: '2024-01-17',
      numero_hospedes: 2,
    });
});

Then('a reserva deve ser criada com sucesso', function () {
  expect(reservaResponse.status).to.equal(201);
});

Then('o valor total deve ser calculado corretamente', function () {
  expect(reservaResponse.body).to.have.property('valor');
  expect(reservaResponse.body.valor).to.be.above(0);
});

Then('a reserva deve conter a propriedade {string}', function (prop) {
  expect(reservaResponse.body).to.have.property(prop);
});

Then('o valor deve ser maior que zero', function () {
  expect(reservaResponse.body.valor).to.be.above(0);
});

Then('o status da reserva deve ser {string}', function (status) {
  expect(reservaResponse.body.status).to.equal(status);
});

When('o sistema calcula o valor da reserva com taxa de luxo', async function () {
  reservaResponse = await request(server)
    .post('/api/reservas')
    .send({
      hospede_id: clientId,
      quarto_id: 2, // Assumindo quarto_id 2 = luxo
      start_date: '2024-02-01',
      end_date: '2024-02-05',
      numero_hospedes: 3,
    });
});

Then('o valor deve incluir a taxa de luxo', function () {
  expect(reservaResponse.body.taxa_luxo).to.be.above(0);
});

Then('o valor deve ser maior que uma reserva padrão', function () {
  expect(reservaResponse.body.valor).to.be.above(200); // exemplo
});

Then('a reserva deve conter detalhes do quarto de luxo', function () {
  expect(reservaResponse.body.quarto.tipo).to.equal('luxo');
});

When('o sistema calcula o valor total com serviços', async function () {
  reservaResponse = await request(server)
    .post('/api/reservas')
    .send({
      hospede_id: clientId,
      quarto_id: 1,
      start_date: '2024-03-10',
      end_date: '2024-03-12',
      servicos: ['cafe_da_manha', 'estacionamento', 'limpeza_diaria'],
    });
});

Then('o valor deve incluir todos os serviços selecionados', function () {
  expect(reservaResponse.body.servicos_incluidos).to.include.members([
    'cafe_da_manha', 'estacionamento', 'limpeza_diaria'
  ]);
});

Then('cada serviço deve ter seu valor individual calculado', function () {
  expect(reservaResponse.body.valor_servicos).to.be.an('object');
});

Then('o valor total deve ser a soma do quarto mais os serviços', function () {
  const totalEsperado = reservaResponse.body.valor_quarto +
    Object.values(reservaResponse.body.valor_servicos).reduce((a, b) => a + b, 0);
  expect(reservaResponse.body.valor).to.be.closeTo(totalEsperado, 0.01);
});

When('o sistema aplica desconto de baixa temporada', async function () {
  reservaResponse = await request(server)
    .post('/api/reservas')
    .send({
      hospede_id: clientId,
      quarto_id: 1,
      start_date: '2024-06-01',
      end_date: '2024-06-10',
    });
});

Then('o valor deve ter desconto aplicado', function () {
  expect(reservaResponse.body.valor_com_desconto).to.exist;
});

Then('o desconto deve ser de {int}% sobre o valor original', function (desconto) {
  const { valor_original, valor_com_desconto } = reservaResponse.body;
  const descontoEsperado = valor_original * (desconto / 100);
  expect(valor_original - valor_com_desconto).to.be.closeTo(descontoEsperado, 0.01);
});

Then('a reserva deve mostrar o valor original e o valor com desconto', function () {
  expect(reservaResponse.body).to.have.property('valor_original');
  expect(reservaResponse.body).to.have.property('valor_com_desconto');
});

When('o sistema calcula taxa de ocupação extra', async function () {
  reservaResponse = await request(server)
    .post('/api/reservas')
    .send({
      hospede_id: clientId,
      quarto_id: 1,
      numero_hospedes: 4,
      capacidade_maxima: 2,
    });
});

Then('o valor deve incluir taxa de ocupação extra', function () {
  expect(reservaResponse.body.taxa_ocupacao_extra).to.exist;
});

Then('a taxa deve ser de {int}% por pessoa adicional', function (taxa) {
  const { valor_ocupacao_extra, valor_diaria } = reservaResponse.body;
  const extraEsperado = valor_diaria * ((taxa / 100) * 2); // 2 pessoas a mais
  expect(valor_ocupacao_extra).to.be.closeTo(extraEsperado, 0.01);
});

Then('o sistema deve alertar sobre a superlotação', function () {
  expect(reservaResponse.body.alerta).to.include('superlotação');
});

When('o sistema calcula o valor das parcelas', async function () {
  reservaResponse = await request(server)
    .post('/api/reservas')
    .send({
      hospede_id: clientId,
      quarto_id: 1,
      start_date: '2024-04-01',
      end_date: '2024-04-05',
      parcelas: 3,
    });
});

Then('o valor total deve ser dividido em {int} parcelas iguais', function (n) {
  expect(reservaResponse.body.parcelas.length).to.equal(n);
});

Then('cada parcela deve ter o valor calculado corretamente', function () {
  const { parcelas, valor } = reservaResponse.body;
  const esperado = valor / parcelas.length;
  parcelas.forEach(p => expect(p.valor).to.be.closeTo(esperado, 0.01));
});

Then('a primeira parcela deve ser cobrada no momento da reserva', function () {
  expect(reservaResponse.body.parcelas[0].status).to.equal('cobrada');
});

