import { test, expect } from '@playwright/test';

// Descreve a suíte de testes para as funcionalidades do Admin
test.describe('Funcionalidades do Administrador', () => {

  // Hook: Executa uma vez ANTES de todos os testes neste arquivo.
  // Sua função é garantir que os dados necessários para o teste existam.
  test.beforeAll(async ({ browser }) => {
    console.log('🚀 Criando usuário de teste para o cenário de admin...');
    const context = await browser.newContext();
    const page = await context.newPage();

    // Cria o usuário que será deletado durante o teste.
    await page.goto('http://localhost:5173/registro-hospede');
    await page.fill('input[name="nome"]', 'Usuario Para Deletar');
    await page.fill('input[name="email"]', 'hospede.existente@test.com'); // O email exato que o teste vai procurar
    await page.fill('input[name="cpf"]', '99988877766'); // Um CPF único
    await page.fill('input[name="senha"]', 'senha123');
    await page.click('button[type="submit"]');
    // Espera uma navegação ou um tempo para garantir que o registro foi processado
    await page.waitForTimeout(1500); 
    
    await context.close();
    console.log('✅ Usuário de teste criado com sucesso.');
  });

  // O cenário de teste em si
  test('Admin deve fazer login, visualizar a lista e remover um usuário', async ({ page }) => {
    
    // Passo 1: Login do Admin
    await page.goto('http://localhost:5173/login-admin');
    await page.fill('input[name="email"]', 'admin@test.com');
    await page.fill('input[name="senha"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin/dashboard');

    // Passo 2: Verificar o painel e encontrar o usuário
    await expect(page.locator('h1')).toHaveText('Painel do Administrador');
    await page.waitForSelector('.user-table tbody tr');
    
    // Procura pela linha da tabela que contém o email do usuário que criamos
    const userRow = page.locator('tr:has-text("hospede.existente@test.com")');
    await expect(userRow).toBeVisible(); // Agora o usuário deve ser encontrado

    // Passo 3: Clicar para remover o usuário
    await userRow.locator('button:has-text("Remover")').click();

    // Passo 4: Confirmar a exclusão no modal
    await page.waitForSelector('.modal-content');
    await page.locator('.modal-actions button.btn-danger').click();

    // Passo 5: Verificar se o usuário foi removido da lista
    await expect(userRow).not.toBeVisible();

    console.log('✅ Teste de fluxo do Admin concluído com sucesso!');
  });
});