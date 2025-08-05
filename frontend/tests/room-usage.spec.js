import { test, expect } from '@playwright/test';

// Global variables to store created data
let hospedeId, hotelId, testRooms = [];

test.describe('Comprehensive Hotel Room Flow', () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log('🚀 Setting up test data...');
    
    // 1a. Create hospede with CPF 335.447.380-07 and password 1234
    console.log('Creating hospede...');
    await page.goto('http://localhost:5173/registro-hospede');
    await page.waitForTimeout(2000);
    await page.fill('input[name="nome"]', 'Teste Hospede');
    await page.fill('input[name="email"]', 'teste.hospede@test.com');
    await page.fill('input[name="cpf"]', '335.447.380-07');
    await page.fill('input[name="senha"]', '1234');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Check if hospede creation was successful or if user already exists
    const hospedeError = page.locator('.error-message');
    if (await hospedeError.isVisible()) {
      console.log('Hospede already exists, continuing...');
    } else {
      console.log('Hospede created successfully');
    }
    
    // 1b. Create hotel with CNPJ 63.032.085/0001-00 and password 1234
    console.log('Creating hotel...');
    await page.goto('http://localhost:5173/registro-hotel');
    await page.waitForTimeout(2000);
    await page.fill('input[name="nome"]', 'Hotel Teste');
    await page.fill('input[name="email"]', 'hotel.teste@test.com');
    await page.fill('input[name="cnpj"]', '63.032.085/0001-00');
    await page.fill('input[name="senha"]', '1234');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Check if hotel creation was successful or if user already exists
    const hotelError = page.locator('.error-message');
    if (await hotelError.isVisible()) {
      console.log('Hotel already exists, continuing...');
    } else {
      console.log('Hotel created successfully');
    }
    
    await context.close();
    console.log('✅ Test data setup complete!');
  });

  test.describe('Hotel Management Tests', () => {
    test.beforeEach(async ({ page }) => {
      // Login with the created hotel before each test
      await page.goto('http://localhost:5173/login-hotel');
      await page.fill('input[name="cnpj"]', '63.032.085/0001-00');
      await page.fill('input[name="senha"]', '1234');
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    });

    test.afterEach(async ({ page }) => {
      // Clean up: Delete the room created in the successful test
      try {
        // Navigate to Ver Quartos page to see the rooms
        await page.goto('http://localhost:5173/hotel-rooms');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // Look for a div that contains "Quarto TEST001"
        // also filter for the class room-card
        const roomCard = page.locator('div.room-card').filter({ hasText: /^Quarto TEST001/ }).first();
        const deleteButton = roomCard.locator('button:has-text("Remover")').first();
        if (await deleteButton.isVisible()) {
          await deleteButton.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(1000);
          
          // Wait for confirmation modal to appear
          await page.waitForSelector('.modal-content', { timeout: 5000 });
          
          // Scroll to the bottom of the modal to ensure the delete button is visible
          const modalContent = page.locator('.modal-content');
          await modalContent.highlight();
          await modalContent.evaluate((el) => {
            el.scrollTop = el.scrollHeight;
          });
          
          // Find and click the "Excluir Quarto" button
          const confirmDeleteButton = page.locator('button:has-text("Excluir Quarto")').first();
          await confirmDeleteButton.highlight();
          await confirmDeleteButton.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(1000);
          console.log('✅ Cleaned up test room TEST-001');
        }
      } catch (error) {
        console.log('⚠️ Cleanup encountered an error:', error.message);
      }
    });

    test('Hotel can publish a new room successfully', async ({ page }) => {
      // Click add new room button in navbar
      await page.click('button:has-text("Adicionar Quarto")');
      await page.waitForLoadState('networkidle');

      // Fill room form with complete data
      await page.fill('input[name="identifier"]', 'TEST001');
      await page.selectOption('select[name="type"]', 'lodge');
      await page.selectOption('select[name="n_of_adults"]', '2');
      await page.fill('input[name="cost"]', '180.00');
      await page.fill('input[name="city"]', 'São Paulo');
      await page.fill('textarea[name="description"]', 'Chalé com vista para o mar');

      // Submit form
      await page.locator('button:has-text("ADICIONAR QUARTO")').last().highlight();
      const button = page.locator('button:has-text("ADICIONAR QUARTO")').last();
      await button.click();
      await page.waitForLoadState('networkidle');

      // Verify success - check if form was submitted successfully
      await page.waitForTimeout(2000);
      
      // Check if modal is closed or if form was cleared (successful submission)
      const modalVisible = await page.locator('.modal-content').isVisible();
      expect(modalVisible).toBe(false);

      // Navigate to Ver Quartos page
      await page.click('button:has-text("Ver Quartos")');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Look for the room that was created in the previous test
      const roomDescription = page.locator('text="Chalé com vista para o mar"');
      const isVisible = await roomDescription.isVisible()
      expect(isVisible).toBe(true);
    });

    test('Hotel cannot publish room with missing required fields', async ({ page }) => {
      // Click add new room button in navbar
      await page.click('button:has-text("Adicionar Quarto")');
      await page.waitForLoadState('networkidle');

      // Fill incomplete room form (missing identifier)
      await page.selectOption('select[name="type"]', 'lodge');
      await page.selectOption('select[name="n_of_adults"]', '2');
      await page.fill('input[name="cost"]', '180.00');
      // Intentionally not filling identifier field

      // Submit form
      const button = page.locator('button:has-text("ADICIONAR QUARTO")').last();
      await button.click();
      await page.waitForLoadState('networkidle');

      // Wait for validation to occur
      await page.waitForTimeout(1000);
      
      // Verify form is still visible (modal not closed due to validation)
      await expect(page.locator('.modal-content')).toBeVisible();
      
      // Method 1: Check if the form submission was prevented by validation
      // The modal should still be visible if validation failed
      const modalStillVisible = await page.locator('.modal-content').isVisible();
      expect(modalStillVisible).toBe(true);
      
      // Method 2: Check if the required field has the :invalid pseudo-class
      const identifierField = page.locator('input[name="identifier"]');
      const isInvalid = await identifierField.evaluate((el) => {
        return el.matches(':invalid');
      });
      expect(isInvalid).toBe(true);
      
      // Method 3: Check if the form has validation errors by looking for the :invalid state
      const form = page.locator('form');
      const formHasValidationErrors = await form.evaluate((el) => {
        return el.checkValidity() === false;
      });
      expect(formHasValidationErrors).toBe(true);
      
      console.log('✅ Form validation prevented submission - required fields missing');
    });
  });

  test.describe('Guest Search Tests', () => {
    test.beforeEach(async ({ page }) => {
      // Login with the created hospede before each test
      await page.goto('http://localhost:5173/login-hospede');
      await page.fill('input[name="cpf"]', '335.447.380-07');
      await page.fill('input[name="senha"]', '1234');
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    });

    test('Guest can search for available rooms', async ({ page }) => {
      // Click search button in navbar
      await page.click('button:has-text("Pesquisar Quartos")');
      await page.waitForLoadState('networkidle');

      // Wait for modal to be visible
      await page.waitForSelector('.modal-content', { timeout: 10000 });
      
      // Fill search form in modal with all required fields
      await page.fill('input[name="city"]', 'Rio de Janeiro');
      await page.selectOption('select[name="n_of_adults"]', '2');
      
      // Use date pickers instead of direct input
      await page.click('input[name="start_date"]');
      await page.fill('input[name="start_date"]', '2025-08-15');
      
      await page.click('input[name="end_date"]');
      await page.fill('input[name="end_date"]', '2025-08-25');

      // Wait for submit button to be visible and clickable
      await page.waitForSelector('button[type="submit"]', { timeout: 10000 });
      
      // Debug: Check if submit button is visible
      // find the button with text "Pesquisar" EXATAMENTE
      const submitButton = page.locator('button:has-text("Pesquisar")').nth(1);
      const isVisible = await submitButton.isVisible();
      await submitButton.click();
      await page.waitForLoadState('networkidle');

      // Wait for the room to load (wait 2 secs)
      await page.waitForTimeout(2000);

      // Look for a description like "Quarto confortável com vista para o mar" (it will have been added in the seed)
      const roomDescription = page.locator('text="Quarto confortável com vista para o mar"');
      const roomDescriptionVisible = await roomDescription.isVisible()
      expect(roomDescriptionVisible).toBe(true);

      // Check if navigation occurred or if search was processed
      const currentUrl = page.url();
      if (currentUrl.includes('search-results')) {
        console.log('✅ Successfully navigated to search results');
      } else {
        console.log('✅ Search form submitted (may not navigate immediately)');
      }
    });

    test('Guest cannot search with incomplete information', async ({ page }) => {
      await page.click('button:has-text("Pesquisar Quartos")');
      await page.waitForLoadState('networkidle');

      // Fill incomplete search form (missing required fields)
      await page.fill('input[name="city"]', 'Recife');
      // Intentionally not filling start_date and end_date

      // Try to submit search - should trigger browser validation
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');

      // Verify form is still visible (modal not closed due to validation)
      await expect(page.locator('.modal-content')).toBeVisible();
      
      // Method 1: Check if the form submission was prevented by validation
      // The modal should still be visible if validation failed
      const modalStillVisible = await page.locator('.modal-content').isVisible();
      expect(modalStillVisible).toBe(true);
      
      
      // Method 2: Check if the form has validation errors by looking for the :invalid state
      const form = page.locator('form');
      const formHasValidationErrors = await form.evaluate((el) => {
        return el.checkValidity() === false;
      });
      expect(formHasValidationErrors).toBe(true);
      
      console.log('✅ Form validation prevented submission - required fields missing');
      
      // Verify we're still on the same page
      await expect(page).toHaveURL(/.*localhost:5173/);
    });
  });
}); 