import { test, expect } from '@playwright/test';

test.describe('My Board Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the my-board page before each test
    await page.goto('/plan/my-board');
  });

  test('should display the grid with correct columns', async ({ page }) => {
    // Wait for the grid to load
    await page.waitForSelector('.ag-root');

    // Check for essential columns
    const columns = [
      { id: 'docstatus', text: 'Status' },
      { id: 'year_1', text: 'ปีปัจจุบัน 2568' },
    ];

    for (const column of columns) {
      // Get column by col-id attribute
      const columnHeader = page.locator(`[col-id="${column.id}"]`);
      await expect(columnHeader).toBeVisible();

      // Verify header cell text
      const headerText = columnHeader.locator('span');
      await expect(headerText).toHaveText(column.text);
    }
  });

  test('should display status labels correctly', async ({ page }) => {
    // Wait for the grid to load
    await page.waitForSelector('.ag-root');

    // Check for status cells
    const statusCells = page.locator('.docstatus');
    await expect(statusCells).toBeVisible();

    // Check for status text (Save or Submitted)
    const statusText = page.getByText(/Save|Submitted/);
    await expect(statusText).toBeVisible();
  });

  test('should handle row selection', async ({ page }) => {
    // Wait for the grid to load
    await page.waitForSelector('.ag-root');

    // Click on a row
    const firstRow = page.locator('.ag-row').first();
    await firstRow.click();

    // Verify row is selected
    await expect(firstRow).toHaveClass(/ag-row-selected/);
  });

  test('should handle tab switching', async ({ page }) => {
    // Wait for tabs to load
    await page.waitForSelector('.MuiTabs-root');

    // Check for tab buttons
    const allTab = page.getByRole('tab', { name: 'All' });
    await expect(allTab).toBeVisible();

    // Click on a different tab
    await allTab.click();

    // Verify tab is selected
    await expect(allTab).toHaveAttribute('aria-selected', 'true');
  });

  test('should handle search functionality', async ({ page }) => {
    // Wait for the grid to load
    await page.waitForSelector('.ag-root');

    // Find and fill the search input
    const searchInput = page.locator('#filter-text-box');
    await searchInput.fill('test');

    // Verify grid updates
    await page.waitForTimeout(500); // Wait for debounce
    const grid = page.locator('.ag-root');
    await expect(grid).toBeVisible();
  });

  test('should handle pagination', async ({ page }) => {
    // Wait for the grid to load
    await page.waitForSelector('.ag-root');

    // Check for pagination controls
    const pagination = page.locator('.ag-paging-panel');
    await expect(pagination).toBeVisible();

    // Check for page size selector
    const pageSizeSelector = page.getByRole('combobox');
    await expect(pageSizeSelector).toBeVisible();
  });

  test('should handle row click navigation', async ({ page }) => {
    // Wait for the grid to load
    await page.waitForSelector('.ag-root');

    // Click on a non-group, non-footer row
    const firstDataRow = page.locator('.ag-row:not(.ag-group-row):not(.ag-footer-row)').first();
    await firstDataRow.click();

    // Verify navigation (URL should change)
    await expect(page).toHaveURL(/.*\/plan\/.*\/update/);
  });

  test('should handle month column visibility', async ({ page }) => {
    // Wait for the grid to load
    await page.waitForSelector('.ag-root');

    // Check for month columns
    const monthColumns = page.locator('.ag-header-cell').filter({ hasText: /january|february|march/i });
    await expect(monthColumns).toBeVisible();
  });
}); 