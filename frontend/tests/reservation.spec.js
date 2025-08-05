import { test, expect } from '@playwright/test';

// Descreve a suíte de testes para as funcionalidades de Reserva
test.describe('Funcionalidades de Reserva e Autenticação', () => {

  // Hook: Executa uma vez ANTES de todos os testes neste arquivo.
  // Garante que todos os dados necessários (hóspede, hotel, quarto) existam.
  test.beforeAll(async ({ browser }) => {
    console.log('🚀 Criando dados de teste para o cenário de reserva...');
    const context = await browser.newContext();
    const page = await context.newPage();

    // 1. Cria o HÓSPEDE de teste que será usado no cenário de sucesso
    await page.goto('http://localhost:5173/registro-hospede');
    await page.fill('input[name="nome"]', 'Isaac Ferreira Silva');
    await page.fill('input[name="email"]', 'isaac.teste@gmail.com');
    await page.fill('input[name="cpf"]', '12345678900'); // CPF para o login
    await page.fill('input[name="senha"]', '123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500); // Espera para garantir que o registro foi processado

    // 2. Cria o HOTEL de teste
    await page.goto('http://localhost:5173/registro-hotel');
    await page.fill('input[name="nome"]', 'Hotel Roteiro de Teste');
    await page.fill('input[name="email"]', 'hotel.reserva@test.com');
    await page.fill('input[name="cnpj"]', '11222333444455');
    await page.fill('input[name="senha"]', 'senha123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);

    // 3. Faz login como o HOTEL para adicionar um quarto
    await page.goto('http://localhost:5173/login-hotel');
    await page.fill('input[name="cnpj"]', '11222333444455');
    await page.fill('input[name="senha"]', 'senha123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/'); // Espera o login completar

    // 4. Adiciona o QUARTO que será buscado e reservado no teste
    await page.click('button:has-text("Adicionar Quarto")');
    await page.waitForSelector('.modal-content');
    await page.fill('input[name="identifier"]', 'R_101'); // Identificador único
    await page.selectOption('select[name="type"]', 'hotelRoom');
    await page.selectOption('select[name="n_of_adults"]', '2');
    await page.fill('input[name="cost"]', '350');
    await page.fill('input[name="city"]', 'Rio de Janeiro'); // Cidade exata da busca
    await page.locator('.modal-content button[type="submit"]').click();
    await page.waitForTimeout(1500);

    await context.close();
    console.log('✅ Dados de teste para reserva foram criados com sucesso.');
  });

  // Cenário de sucesso para um hóspede logado
  test('Hóspede logado deve conseguir reservar um quarto com sucesso', async ({ page }) => {
    // 1. Fazer login como Hóspede
    await page.goto('http://localhost:5173/login-hospede');
    await page.fill('input[name="cpf"]', '12345678900');
    await page.fill('input[name="senha"]', '123');
    await page.click('button[type="submit"]');
    // Verifica se o login foi bem-sucedido esperando por um elemento da página de logado
    await expect(page.locator('button:has-text("Pesquisar Quartos")')).toBeVisible();

    // 2. Buscar pelo quarto
    await page.click('button:has-text("Pesquisar Quartos")');
    await page.waitForSelector('.modal-content');
    await page.fill('input[name="city"]', 'Rio de Janeiro');
    await page.selectOption('select[name="n_of_adults"]', '2');
    await page.fill('input[name="start_date"]', '2025-11-10');
    await page.fill('input[name="end_date"]', '2025-11-15');
    await page.locator('.modal-content button[type="submit"]').click();
    await page.waitForURL('**/search-results');

    // 3. Encontrar o quarto e clicar para reservar
    const roomCard = page.locator('.room-card:has-text("Quarto R_101")');
    await expect(roomCard).toBeVisible(); // Agora o quarto deve ser encontrado
    await roomCard.locator('.btn-reservar').click();

    // 4. Confirmar no modal
    await page.waitForSelector('.modal-content');
    await page.locator('.modal-actions button.btn-primary').click();

    // 5. Verificar a mensagem de sucesso
    await page.waitForSelector('.success-toast');
    await expect(page.locator('.success-toast h4')).toHaveText('Reserva Confirmada!');
  });

  // Cenário corrigido para um usuário não logado
  test('Usuário não logado deve ser redirecionado para o login ao tentar acessar uma página protegida', async ({ page }) => {
    await page.goto('http://localhost:5173/perfil');
    await page.waitForURL('**/login-hospede');
    await expect(page).toHaveURL(/.*login-hospede/);
    await expect(page.locator('h1')).toHaveText('Bem-vindo de volta!');
  });
});