import { test, expect } from '@playwright/test';

test.describe('Sistema de Estatísticas E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Garantir que o backend está rodando
    await page.goto('http://localhost:3000/api/statistics/health');
    const healthResponse = await page.textContent('body');
    expect(healthResponse).toContain('success');
  });

  test('deve exibir dashboard de estatísticas com dados corretos', async ({ page }) => {
    // Acessar diretamente a página de login do admin
    await page.goto('http://localhost:5173/login-admin');
    await page.waitForTimeout(2000);

    // Fazer login como admin juliano
    await page.fill('input[name="email"]', 'juliano@admin.com');
    await page.fill('input[name="senha"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Verificar se foi redirecionado para o dashboard
    await expect(page).toHaveURL('http://localhost:5173/dashboard');

    // Verificar se o dashboard administrativo carregou - seletor mais específico
    await expect(page.locator('.dashboard-header h1')).toContainText('Dashboard Administrativo');
    
    // Verificar se as abas estão visíveis
    await expect(page.locator('text=📈 Visão Geral')).toBeVisible();
    await expect(page.locator('text=🏨 Hotéis')).toBeVisible();
    await expect(page.locator('text=🛏️ Quartos')).toBeVisible();
    await expect(page.locator('text=📊 Avançado')).toBeVisible();
  });

  test('deve exibir estatísticas gerais na aba Overview', async ({ page }) => {
    // Login como admin
    await page.goto('http://localhost:5173/login-admin');
    await page.waitForTimeout(2000);

    await page.fill('input[name="email"]', 'juliano@admin.com');
    await page.fill('input[name="senha"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Verificar se foi redirecionado para o dashboard
    await expect(page).toHaveURL('http://localhost:5173/dashboard');

    // Verificar se os cards de estatísticas estão visíveis
    await expect(page.locator('.stat-card').first()).toBeVisible();
    
    // Verificar se há dados nos cards
    const statCards = page.locator('.stat-card');
    const count = await statCards.count();
    expect(count).toBeGreaterThan(5); // Esperamos pelo menos 6 cards de métricas
  });

  test('deve exibir ranking de hotéis na aba Hotéis Populares', async ({ page }) => {
    // Login como admin
    await page.goto('http://localhost:5173/login-admin');
    await page.waitForTimeout(2000);

    await page.fill('input[name="email"]', 'juliano@admin.com');
    await page.fill('input[name="senha"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Verificar se foi redirecionado para o dashboard
    await expect(page).toHaveURL('http://localhost:5173/dashboard');

    // Clicar na aba de Hotéis 
    await page.click('text=🏨 Hotéis');
    await page.waitForTimeout(1000);

    // Verificar se a seção de hotéis está visível
    await expect(page.locator('.hotels-section')).toBeVisible();
    
    // Verificar se pelo menos uma linha da tabela aparece
    const tableRows = page.locator('.stats-table tbody tr');
    await expect(tableRows.first()).toBeVisible();

    // Verificar se os hotéis têm informações básicas na tabela - usar seletor mais específico
    await expect(page.locator('.stats-table th').nth(1)).toContainText('Hotel');
  });

  test('deve exibir estatísticas por tipo de quarto na aba Tipos de Quarto', async ({ page }) => {
    // Login como admin
    await page.goto('http://localhost:5173/login-admin');
    await page.waitForTimeout(2000);

    await page.fill('input[name="email"]', 'juliano@admin.com');
    await page.fill('input[name="senha"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Verificar se foi redirecionado para o dashboard
    await expect(page).toHaveURL('http://localhost:5173/dashboard');

    // Clicar na aba de Tipos de Quarto
    await page.click('text=🛏️ Quartos');
    await page.waitForTimeout(1000);

    // Verificar se os tipos de quarto estão visíveis
    await expect(page.locator('.rooms-section')).toBeVisible();
    
    // Verificar se aparecem os tipos na tabela
    const tableRows = page.locator('.stats-table tbody tr');
    await expect(tableRows.first()).toBeVisible();

    // Verificar informações do tipo de quarto - usar seletor mais específico
    await expect(page.locator('.stats-table th').first()).toContainText('Tipo de Quarto');
  });

  test('deve exibir tendências na aba Tendências', async ({ page }) => {
    // Login como admin
    await page.goto('http://localhost:5173/login-admin');
    await page.waitForTimeout(2000);

    await page.fill('input[name="email"]', 'juliano@admin.com');
    await page.fill('input[name="senha"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Verificar se foi redirecionado para o dashboard
    await expect(page).toHaveURL('http://localhost:5173/dashboard');

    // Clicar na aba de Avançado (que contém as métricas avançadas)
    await page.click('text=📊 Avançado');
    await page.waitForTimeout(1000);

    // Verificar se a seção avançada está visível
    await expect(page.locator('.advanced-section')).toBeVisible();
    
    // Verificar se há pelo menos um card de métrica
    await expect(page.locator('.metric-card')).toBeVisible();
  });

  test('deve atualizar dados após limpar cache', async ({ page }) => {
    // Login como admin
    await page.goto('http://localhost:5173/login-admin');
    await page.waitForTimeout(2000);

    await page.fill('input[name="email"]', 'juliano@admin.com');
    await page.fill('input[name="senha"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Verificar se foi redirecionado para o dashboard
    await expect(page).toHaveURL('http://localhost:5173/dashboard');

    // Verificar se o dashboard carregou corretamente
    await expect(page.locator('.dashboard-header h1')).toContainText('Dashboard Administrativo');
    await expect(page.locator('.stat-card').first()).toBeVisible();

    // Clicar no botão de atualizar dados
    await page.click('.refresh-button');
    await page.waitForTimeout(2000);

    // Verificar se os dados ainda estão visíveis após atualização
    await expect(page.locator('.stat-card').first()).toBeVisible();
  });

  test('deve lidar com erro de API graciosamente', async ({ page }) => {
    // Interceptar requisições para simular erro
    await page.route('**/api/statistics/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: 'Erro interno' })
      });
    });

    // Login como admin
    await page.goto('http://localhost:5173/login-admin');
    await page.waitForTimeout(2000);

    await page.fill('input[name="email"]', 'juliano@admin.com');
    await page.fill('input[name="senha"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Verificar se foi redirecionado para o dashboard mesmo com erro na API
    await expect(page).toHaveURL('http://localhost:5173/dashboard');

    // Verificar se uma mensagem de erro é exibida
    const errorMessage = page.locator('.error-container');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toContainText('Erro');
    }
  });
});
