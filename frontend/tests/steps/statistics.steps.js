import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { chromium } from '@playwright/test';

let page;
let browser;
let context;
let apiResponse;

Before(async function() {
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();
});

After(async function() {
  if (page) await page.close();
  if (context) await context.close();
  if (browser) await browser.close();
});

// Cenário: Visualizar estatísticas gerais do sistema
Given('que existe um sistema com {int} hotéis cadastrados', async function (hotelCount) {
  // Verificar se a API retorna o número esperado de hotéis
  await page.goto('http://localhost:3000/api/statistics/overview');
  const response = await page.textContent('body');
  const data = JSON.parse(response);
  expect(data.data.totalHotels).toEqual(hotelCount);
});

Given('existem {int} quartos distribuídos entre os hotéis', async function (roomCount) {
  // Esta verificação já é feita junto com a anterior na API overview
  await page.goto('http://localhost:3000/api/statistics/overview');
  const response = await page.textContent('body');
  const data = JSON.parse(response);
  expect(data.data.totalRooms).toEqual(roomCount);
});

Given('existem {int} hóspedes cadastrados no sistema', async function (hospedeCount) {
  // Verificação já feita na API overview
  await page.goto('http://localhost:3000/api/statistics/overview');
  const response = await page.textContent('body');
  const data = JSON.parse(response);
  expect(data.data.totalHospedes).toEqual(hospedeCount);
});

Given('existem {int} reservas realizadas com receita total de R$ {int}', async function (reservationCount, revenue) {
  await page.goto('http://localhost:3000/api/statistics/overview');
  const response = await page.textContent('body');
  const data = JSON.parse(response);
  expect(data.data.totalReservations).toEqual(reservationCount);
  expect(data.data.totalRevenue).toEqual(revenue);
});

When('solicito as estatísticas gerais do sistema', async function () {
  await page.goto('http://localhost:3000/api/statistics/overview');
  apiResponse = await page.textContent('body');
});

Then('recebo uma resposta de sucesso com código {string}', async function () {
  expect(page.url()).toContain('/api/statistics/');
  const data = JSON.parse(apiResponse);
  expect(data.success).toBe(true);
});

Then('os dados incluem totalHotels {string}, totalHospedes {string}, totalRooms {string}, totalReservations {string} e totalRevenue {string}', 
  async function (hotels, hospedes, rooms, reservations, revenue) {
    const data = JSON.parse(apiResponse);
    expect(data.data.totalHotels.toString()).toEqual(hotels);
    expect(data.data.totalHospedes.toString()).toEqual(hospedes);
    expect(data.data.totalRooms.toString()).toEqual(rooms);
    expect(data.data.totalReservations.toString()).toEqual(reservations);
    expect(data.data.totalRevenue.toString()).toEqual(revenue);
  });

// Cenário: Obter ranking de hotéis por receita
Given('que existem hotéis {string}, {string} e {string} cadastrados', async function (hotel1, hotel2, hotel3) {
  await page.goto('http://localhost:3000/api/statistics/top-hotels');
  const response = await page.textContent('body');
  const data = JSON.parse(response);
  
  const hotelNames = data.data.map(hotel => hotel.hotel_name);
  expect(hotelNames).toContain(hotel1.replace(/"/g, ''));
  expect(hotelNames).toContain(hotel2.replace(/"/g, ''));
  expect(hotelNames).toContain(hotel3.replace(/"/g, ''));
});

Given('cada hotel possui quartos com diferentes receitas potenciais', async function () {
  // Esta condição é verificada implicitamente pelos dados de teste
  await page.goto('http://localhost:3000/api/statistics/top-hotels');
  const response = await page.textContent('body');
  const data = JSON.parse(response);
  expect(data.data.length).toBeGreaterThan(0);
});

When('solicito o ranking de hotéis por receita', async function () {
  await page.goto('http://localhost:3000/api/statistics/top-hotels');
  apiResponse = await page.textContent('body');
});

Then('a lista retorna os hotéis ordenados por receita total decrescente', async function () {
  const data = JSON.parse(apiResponse);
  const revenues = data.data.map(hotel => hotel.total_revenue);
  
  // Verificar se está ordenado em ordem decrescente
  for (let i = 0; i < revenues.length - 1; i++) {
    expect(revenues[i]).toBeGreaterThanOrEqual(revenues[i + 1]);
  }
});

Then('cada hotel inclui informações de {string}, {string}, {string}, {string} e {string}', 
  async function (field1, field2, field3, field4, field5) {
    const data = JSON.parse(apiResponse);
    const firstHotel = data.data[0];
    
    expect(firstHotel).toHaveProperty(field1.replace(/"/g, ''));
    expect(firstHotel).toHaveProperty(field2.replace(/"/g, ''));
    expect(firstHotel).toHaveProperty(field3.replace(/"/g, ''));
    expect(firstHotel).toHaveProperty(field4.replace(/"/g, ''));
    expect(firstHotel).toHaveProperty(field5.replace(/"/g, ''));
  });

// Cenário: Visualizar estatísticas por tipo de quarto
Given('que existem quartos do tipo {string} e {string} no sistema', async function (type1, type2) {
  await page.goto('http://localhost:3000/api/statistics/by-room-type');
  const response = await page.textContent('body');
  const data = JSON.parse(response);
  
  const roomTypes = data.data.map(room => room.room_type);
  expect(roomTypes).toContain(type1.replace(/"/g, ''));
  expect(roomTypes).toContain(type2.replace(/"/g, ''));
});

Given('os quartos {string} têm preço médio superior aos {string}', async function (type1, type2) {
  await page.goto('http://localhost:3000/api/statistics/by-room-type');
  const response = await page.textContent('body');
  const data = JSON.parse(response);
  
  const lodge = data.data.find(room => room.room_type === type1.replace(/"/g, ''));
  const hotelRoom = data.data.find(room => room.room_type === type2.replace(/"/g, ''));
  
  if (lodge && hotelRoom) {
    expect(lodge.avg_price).toBeGreaterThan(hotelRoom.avg_price);
  }
});

When('solicito as estatísticas por tipo de quarto', async function () {
  await page.goto('http://localhost:3000/api/statistics/by-room-type');
  apiResponse = await page.textContent('body');
});

Then('os dados incluem para cada tipo: {string}, {string}, {string}, {string} e {string}', 
  async function (field1, field2, field3, field4, field5) {
    const data = JSON.parse(apiResponse);
    const firstRoomType = data.data[0];
    
    expect(firstRoomType).toHaveProperty(field1.replace(/"/g, ''));
    expect(firstRoomType).toHaveProperty(field2.replace(/"/g, ''));
    expect(firstRoomType).toHaveProperty(field3.replace(/"/g, ''));
    expect(firstRoomType).toHaveProperty(field4.replace(/"/g, ''));
    expect(firstRoomType).toHaveProperty(field5.replace(/"/g, ''));
  });

// Cenário: Limpar cache das estatísticas
Given('que o sistema possui cache de estatísticas ativo', async function () {
  // Fazer uma requisição para garantir que há cache
  await page.goto('http://localhost:3000/api/statistics/overview');
  const response = await page.textContent('body');
  const data = JSON.parse(response);
  expect(data.success).toBe(true);
});

When('solicito a limpeza do cache via DELETE', async function () {
  // Usar fetch para fazer DELETE request
  const response = await page.evaluate(async () => {
    const res = await fetch('http://localhost:3000/api/statistics/cache', { method: 'DELETE' });
    return await res.text();
  });
  apiResponse = response;
});

Then('a mensagem confirma que o {string}', async function () {
  const data = JSON.parse(apiResponse);
  expect(data.success).toBe(true);
  expect(data.message).toContain('Cache cleared');
});

// Cenários genéricos
When('solicito qualquer estatística do sistema', async function () {
  await page.goto('http://localhost:3000/api/statistics/overview');
  apiResponse = await page.textContent('body');
});

When('solicito todas as estatísticas em uma única requisição', async function () {
  await page.goto('http://localhost:3000/api/statistics/all');
  apiResponse = await page.textContent('body');
});

When('solicito o status de saúde das estatísticas', async function () {
  await page.goto('http://localhost:3000/api/statistics/health');
  apiResponse = await page.textContent('body');
});

Then('a resposta inclui {string}, {string}, {string}, {string}, {string} e {string}', 
  async function (field1, field2, field3, field4, field5, field6) {
    const data = JSON.parse(apiResponse);
    expect(data.data).toHaveProperty(field1.replace(/"/g, ''));
    expect(data.data).toHaveProperty(field2.replace(/"/g, ''));
    expect(data.data).toHaveProperty(field3.replace(/"/g, ''));
    expect(data.data).toHaveProperty(field4.replace(/"/g, ''));
    expect(data.data).toHaveProperty(field5.replace(/"/g, ''));
    expect(data.data).toHaveProperty(field6.replace(/"/g, ''));
  });

Then('os dados incluem {string} indicando que o sistema está funcionando', async function (statusField) {
  const data = JSON.parse(apiResponse);
  expect(data.data).toHaveProperty(statusField.replace(/"/g, ''));
  expect(data.data.status).toBeTruthy();
});

Then('inclui {string} com a data e hora da verificação', async function (timestampField) {
  const data = JSON.parse(apiResponse);
  expect(data.data).toHaveProperty(timestampField.replace(/"/g, ''));
  expect(data.data.timestamp).toBeTruthy();
});
