const { test, expect } = require('@playwright/test');

test.describe('Funcionalidade de Favoritos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve carregar a página inicial com anúncios', async ({ page }) => {
    // Verifica se a página carrega corretamente
    await expect(page.locator('h1')).toContainText('Encontre o Hotel Perfeito');
    
    // Verifica se há anúncios sendo exibidos
    await expect(page.locator('[data-testid="anuncio-card"]')).toHaveCount.greaterThan(0);
  });

  test('deve permitir favoritar um anúncio', async ({ page }) => {
    // Aguarda os anúncios carregarem
    await page.waitForSelector('[data-testid="anuncio-card"]');
    
    // Clica no botão de favoritar do primeiro anúncio
    const firstAnuncio = page.locator('[data-testid="anuncio-card"]').first();
    const favoritarButton = firstAnuncio.locator('[data-testid="favoritar-button"]');
    
    await favoritarButton.click();
    
    // Verifica se o botão mudou para "favoritado"
    await expect(favoritarButton).toHaveAttribute('data-favoritado', 'true');
  });

  test('deve permitir desfavoritar um anúncio', async ({ page }) => {
    // Primeiro favorita um anúncio
    await page.waitForSelector('[data-testid="anuncio-card"]');
    const firstAnuncio = page.locator('[data-testid="anuncio-card"]').first();
    const favoritarButton = firstAnuncio.locator('[data-testid="favoritar-button"]');
    
    await favoritarButton.click();
    await expect(favoritarButton).toHaveAttribute('data-favoritado', 'true');
    
    // Agora desfavorita
    await favoritarButton.click();
    await expect(favoritarButton).toHaveAttribute('data-favoritado', 'false');
  });

  test('deve navegar para a página de favoritos', async ({ page }) => {
    // Clica no link de favoritos no menu
    await page.click('text=Favoritos');
    
    // Verifica se navegou para a página correta
    await expect(page).toHaveURL('/favoritos');
    await expect(page.locator('h1')).toContainText('Meus Favoritos');
  });

  test('deve exibir favoritos salvos na página de favoritos', async ({ page }) => {
    // Primeiro favorita um anúncio na página inicial
    await page.waitForSelector('[data-testid="anuncio-card"]');
    const firstAnuncio = page.locator('[data-testid="anuncio-card"]').first();
    await firstAnuncio.locator('[data-testid="favoritar-button"]').click();
    
    // Navega para a página de favoritos
    await page.click('text=Favoritos');
    
    // Verifica se o favorito aparece na lista
    await expect(page.locator('[data-testid="favorito-item"]')).toHaveCount.greaterThan(0);
  });

  test('deve permitir criar uma nova pasta', async ({ page }) => {
    // Navega para a página de favoritos
    await page.click('text=Favoritos');
    
    // Clica no botão de criar pasta
    await page.click('text=Nova Pasta');
    
    // Preenche o formulário
    await page.fill('input[placeholder="Ex: Hotéis em São Paulo"]', 'Hotéis de Luxo');
    await page.fill('textarea[placeholder="Descreva o conteúdo desta pasta..."]', 'Hotéis 5 estrelas');
    
    // Clica em criar
    await page.click('text=Criar Pasta');
    
    // Verifica se a pasta foi criada
    await expect(page.locator('text=Hotéis de Luxo')).toBeVisible();
  });

  test('deve permitir filtrar favoritos', async ({ page }) => {
    // Navega para a página de favoritos
    await page.click('text=Favoritos');
    
    // Usa o campo de busca
    await page.fill('input[placeholder="Buscar favoritos..."]', 'luxo');
    
    // Verifica se os resultados foram filtrados
    await expect(page.locator('[data-testid="favorito-item"]')).toBeVisible();
  });

  test('deve permitir compartilhar favoritos', async ({ page }) => {
    // Navega para a página de favoritos
    await page.click('text=Favoritos');
    
    // Clica no botão de compartilhar
    await page.click('text=Compartilhar');
    
    // Verifica se aparece o modal ou link de compartilhamento
    await expect(page.locator('text=Link compartilhado')).toBeVisible();
  });

  test('deve permitir exportar favoritos', async ({ page }) => {
    // Navega para a página de favoritos
    await page.click('text=Favoritos');
    
    // Clica no botão de exportar
    await page.click('text=Exportar');
    
    // Verifica se o relatório foi gerado
    await expect(page.locator('text=Relatório gerado')).toBeVisible();
  });

  test('deve exibir estatísticas na página de favoritos', async ({ page }) => {
    // Navega para a página de favoritos
    await page.click('text=Favoritos');
    
    // Verifica se as estatísticas estão sendo exibidas
    await expect(page.locator('text=Total de Favoritos')).toBeVisible();
    await expect(page.locator('text=Visitados')).toBeVisible();
    await expect(page.locator('text=Alertas de Preço')).toBeVisible();
    await expect(page.locator('text=Pastas Criadas')).toBeVisible();
  });

  test('deve permitir alternar entre visualização em grid e lista', async ({ page }) => {
    // Navega para a página de favoritos
    await page.click('text=Favoritos');
    
    // Verifica se está em visualização grid por padrão
    await expect(page.locator('[data-testid="grid-view"]')).toBeVisible();
    
    // Clica no botão de visualização em lista
    await page.click('[data-testid="list-view-button"]');
    
    // Verifica se mudou para visualização em lista
    await expect(page.locator('[data-testid="list-view"]')).toBeVisible();
  });
});

test.describe('Responsividade', () => {
  test('deve funcionar em dispositivos móveis', async ({ page }) => {
    // Define viewport móvel
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Verifica se o menu mobile funciona
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Navega para favoritos via menu mobile
    await page.click('text=Favoritos');
    await expect(page).toHaveURL('/favoritos');
  });
});

test.describe('Acessibilidade', () => {
  test('deve ter navegação por teclado funcionando', async ({ page }) => {
    await page.goto('/');
    
    // Navega usando Tab
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Pressiona Enter no link de favoritos
    await page.keyboard.press('Enter');
    
    // Verifica se navegou para favoritos
    await expect(page).toHaveURL('/favoritos');
  });

  test('deve ter atributos ARIA apropriados', async ({ page }) => {
    await page.goto('/');
    
    // Verifica se os botões têm roles apropriados
    await expect(page.locator('[data-testid="favoritar-button"]')).toHaveAttribute('aria-label');
  });
}); 