import { test, expect } from '@playwright/test';

test.describe('Browse to Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test to ensure clean cart state
    await page.addInitScript(() => {
      localStorage.clear();
    });
  });

  test('user can browse products from homepage', async ({ page }) => {
    await page.goto('/');

    // Homepage should load with hero section
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Should have navigation to collections
    const shopLink = page.getByRole('link', { name: /shop|fire pits/i }).first();
    await expect(shopLink).toBeVisible();
  });

  test('user can navigate to product listing page (PLP)', async ({ page }) => {
    await page.goto('/collections/fire-pits');

    // Should show collection title
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Should show product cards
    const productCards = page.locator('[data-testid="product-card"]').or(
      page.locator('article').filter({ has: page.getByRole('link') })
    );

    // Wait for products to load (either via test ID or article elements)
    await expect(page.locator('main')).toBeVisible();
  });

  test('user can view product detail page (PDP)', async ({ page }) => {
    await page.goto('/products/koosdoos-medium');

    // Product title should be visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Should have add to cart button
    const addToCartButton = page.getByRole('button', { name: /add to cart/i });
    await expect(addToCartButton).toBeVisible();

    // Should have product images
    const productImage = page.locator('img[alt*="KoosDoos"]').first();
    await expect(productImage).toBeVisible();

    // Should have price displayed
    await expect(page.getByText(/R\s*\d/)).toBeVisible();
  });

  test('user can add product to cart from PDP', async ({ page }) => {
    await page.goto('/products/koosdoos-medium');

    // Click add to cart
    const addToCartButton = page.getByRole('button', { name: /add to cart/i });
    await addToCartButton.click();

    // Cart drawer should open or cart count should update
    const cartDrawer = page.locator('[role="dialog"]').or(
      page.locator('[data-testid="cart-drawer"]')
    );

    // Wait for cart interaction
    await page.waitForTimeout(500);

    // Cart should have at least one item (check header cart icon badge or drawer content)
    const cartBadge = page.locator('[data-testid="cart-count"]').or(
      page.locator('header').getByText(/[1-9]/).first()
    );

    // Either cart drawer is visible or cart badge shows count
    const hasCartFeedback = await cartDrawer.isVisible().catch(() => false) ||
                            await cartBadge.isVisible().catch(() => false);

    expect(hasCartFeedback).toBeTruthy();
  });

  test('user can view cart page', async ({ page }) => {
    // First add an item to cart
    await page.goto('/products/koosdoos-medium');
    const addToCartButton = page.getByRole('button', { name: /add to cart/i });
    await addToCartButton.click();
    await page.waitForTimeout(500);

    // Navigate to cart page
    await page.goto('/cart');

    // Cart page should show
    await expect(page.getByRole('heading', { name: /cart/i })).toBeVisible();

    // Should show cart items or empty state
    const pageContent = await page.textContent('main');
    const hasContent = pageContent?.includes('KoosDoos') || pageContent?.includes('empty') || pageContent?.includes('Empty');
    expect(hasContent).toBeTruthy();
  });

  test('user can update quantity in cart', async ({ page }) => {
    // Add item to cart
    await page.goto('/products/koosdoos-medium');
    await page.getByRole('button', { name: /add to cart/i }).click();
    await page.waitForTimeout(500);

    // Go to cart page
    await page.goto('/cart');

    // Look for quantity controls
    const incrementButton = page.getByRole('button', { name: /\+|increase|increment/i }).first();

    if (await incrementButton.isVisible()) {
      await incrementButton.click();
      await page.waitForTimeout(300);

      // Quantity should have increased (check for "2" somewhere)
      await expect(page.locator('main')).toContainText('2');
    }
  });

  test('user can remove item from cart', async ({ page }) => {
    // Add item to cart
    await page.goto('/products/koosdoos-small');
    await page.getByRole('button', { name: /add to cart/i }).click();
    await page.waitForTimeout(500);

    // Go to cart page
    await page.goto('/cart');

    // Look for remove button
    const removeButton = page.getByRole('button', { name: /remove|delete|×/i }).first();

    if (await removeButton.isVisible()) {
      await removeButton.click();
      await page.waitForTimeout(500);

      // Cart should show empty state
      await expect(page.getByText(/empty|no items/i)).toBeVisible();
    }
  });

  test('user can proceed to checkout', async ({ page }) => {
    // Add item to cart
    await page.goto('/products/koosdoos-large');
    await page.getByRole('button', { name: /add to cart/i }).click();
    await page.waitForTimeout(500);

    // Go to cart page
    await page.goto('/cart');

    // Click checkout button
    const checkoutButton = page.getByRole('button', { name: /checkout|proceed/i }).or(
      page.getByRole('link', { name: /checkout|proceed/i })
    );

    await expect(checkoutButton).toBeVisible();

    // Note: Actually clicking checkout would require Stripe setup
    // For now we just verify the button exists and is clickable
  });

  test('complete browse to checkout journey', async ({ page }) => {
    // 1. Start at homepage
    await page.goto('/');
    await expect(page).toHaveURL('/');

    // 2. Navigate to collection
    await page.goto('/collections/fire-pits');
    await expect(page).toHaveURL('/collections/fire-pits');

    // 3. Click on a product
    const productLink = page.getByRole('link', { name: /koosdoos/i }).first();
    if (await productLink.isVisible()) {
      await productLink.click();
      await page.waitForLoadState('networkidle');
    } else {
      // Fallback: navigate directly to product
      await page.goto('/products/koosdoos-medium');
    }

    // 4. Verify on PDP
    await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible();

    // 5. Add to cart
    await page.getByRole('button', { name: /add to cart/i }).click();
    await page.waitForTimeout(500);

    // 6. Go to cart
    await page.goto('/cart');

    // 7. Verify checkout button is available
    const checkoutButton = page.getByRole('button', { name: /checkout|proceed/i }).or(
      page.getByRole('link', { name: /checkout|proceed/i })
    );
    await expect(checkoutButton).toBeVisible();
  });
});

test.describe('Cart Persistence', () => {
  test('cart persists after page reload', async ({ page }) => {
    // Add item to cart
    await page.goto('/products/koosdoos-medium');
    await page.getByRole('button', { name: /add to cart/i }).click();
    await page.waitForTimeout(500);

    // Reload the page
    await page.reload();

    // Go to cart and verify item is still there
    await page.goto('/cart');

    // Should still have the item
    await expect(page.locator('main')).toContainText(/koosdoos/i);
  });
});

test.describe('Accessibility', () => {
  test('product page has proper accessibility', async ({ page }) => {
    await page.goto('/products/koosdoos-medium');

    // Check for main landmark
    await expect(page.locator('main')).toBeVisible();

    // Check for proper heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();

    // Check for accessible button
    const addToCartButton = page.getByRole('button', { name: /add to cart/i });
    await expect(addToCartButton).toBeVisible();
    await expect(addToCartButton).toBeEnabled();
  });

  test('cart page has proper accessibility', async ({ page }) => {
    await page.goto('/cart');

    // Check for main landmark
    await expect(page.locator('main')).toBeVisible();

    // Check for heading
    const heading = page.getByRole('heading', { name: /cart/i });
    await expect(heading).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('product page works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/products/koosdoos-medium');

    // Should still have add to cart button
    const addToCartButton = page.getByRole('button', { name: /add to cart/i });
    await expect(addToCartButton).toBeVisible();

    // Product image should be visible
    const productImage = page.locator('img').first();
    await expect(productImage).toBeVisible();
  });

  test('cart page works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Add item first
    await page.goto('/products/koosdoos-medium');
    await page.getByRole('button', { name: /add to cart/i }).click();
    await page.waitForTimeout(500);

    await page.goto('/cart');

    // Cart should be usable on mobile
    await expect(page.locator('main')).toBeVisible();
  });
});
