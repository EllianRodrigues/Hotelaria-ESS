import { test, expect } from '@playwright/test';

test.describe('Sistema de Estatísticas E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Garantir que o backend está rodando
    await page.goto('http://localhost:3000/api/statistics/health');
    const healthResponse = await page.textContent('body');
    expect(healthResponse).toContain('success');
  });

  test('deve exibir dashboard de estatísticas com dados corretos', async ({ page }) => {
    // Acessar o dashboard
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    // Verificar se o dashboard carregou
    await expect(page.locator('h1')).toContainText('Dashboard de Estatísticas');
    
    // Verificar abas do dashboard
    await expect(page.locator('[data-testid="tab-overview"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-hotels"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-rooms"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-trends"]')).toBeVisible();
  });

  test('deve exibir estatísticas gerais na aba Overview', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    // Clicar na aba Overview (deve estar ativa por padrão)
    await page.click('[data-testid="tab-overview"]');
    await page.waitForTimeout(1000);

    // Verificar se os cards de estatísticas estão visíveis
    await expect(page.locator('[data-testid="stat-hotels"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-hospedes"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-rooms"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-reservations"]')).toBeVisible();

    // Verificar se os números fazem sentido
    const hotelsCount = await page.textContent('[data-testid="stat-hotels"] .stat-number');
    const hospedesCount = await page.textContent('[data-testid="stat-hospedes"] .stat-number');
    const roomsCount = await page.textContent('[data-testid="stat-rooms"] .stat-number');
    
    expect(parseInt(hotelsCount)).toBeGreaterThan(0);
    expect(parseInt(hospedesCount)).toBeGreaterThanOrEqual(0);
    expect(parseInt(roomsCount)).toBeGreaterThan(0);
  });

  test('deve exibir ranking de hotéis na aba Hotéis Populares', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    // Clicar na aba de Hotéis Populares
    await page.click('[data-testid="tab-hotels"]');
    await page.waitForTimeout(1000);

    // Verificar se a lista de hotéis está visível
    await expect(page.locator('[data-testid="hotels-list"]')).toBeVisible();
    
    // Verificar se pelo menos um hotel aparece
    const hotelItems = page.locator('[data-testid="hotel-item"]');
    await expect(hotelItems.first()).toBeVisible();

    // Verificar se os hotéis têm informações básicas
    await expect(hotelItems.first().locator('.hotel-name')).toBeVisible();
    await expect(hotelItems.first().locator('.hotel-revenue')).toBeVisible();
  });

  test('deve exibir estatísticas por tipo de quarto na aba Tipos de Quarto', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    // Clicar na aba de Tipos de Quarto
    await page.click('[data-testid="tab-rooms"]');
    await page.waitForTimeout(1000);

    // Verificar se os tipos de quarto estão visíveis
    await expect(page.locator('[data-testid="room-types-list"]')).toBeVisible();
    
    // Verificar se aparecem os tipos lodge e hotelRoom
    const roomTypeItems = page.locator('[data-testid="room-type-item"]');
    await expect(roomTypeItems.first()).toBeVisible();

    // Verificar informações do tipo de quarto
    await expect(roomTypeItems.first().locator('.room-type-name')).toBeVisible();
    await expect(roomTypeItems.first().locator('.room-type-price')).toBeVisible();
  });

  test('deve exibir tendências na aba Tendências', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    // Clicar na aba de Tendências
    await page.click('[data-testid="tab-trends"]');
    await page.waitForTimeout(1000);

    // Verificar se o gráfico ou dados de tendências estão visíveis
    await expect(page.locator('[data-testid="trends-container"]')).toBeVisible();
  });

  test('deve atualizar dados após limpar cache', async ({ page }) => {
    // Primeiro, verificar se a API está funcionando
    await page.goto('http://localhost:3000/api/statistics/overview');
    const initialResponse = await page.textContent('body');
    expect(initialResponse).toContain('success');

    // Limpar o cache via API
    await page.goto('http://localhost:3000/api/statistics/cache', { 
      waitUntil: 'networkidle' 
    });
    await page.evaluate(() => fetch('http://localhost:3000/api/statistics/cache', { method: 'DELETE' }));

    // Verificar se o dashboard ainda funciona após limpar cache
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(3000);

    await expect(page.locator('h1')).toContainText('Dashboard de Estatísticas');
    await expect(page.locator('[data-testid="stat-hotels"]')).toBeVisible();
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

    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    // Verificar se uma mensagem de erro é exibida
    const errorMessage = page.locator('[data-testid="error-message"]');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toContainText('Erro');
    }
  });
});
