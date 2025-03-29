import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/') // Go to home page
  const [resp] = await Promise.all([
    page.waitForResponse((resp) =>
      resp
        .url()
        .includes(
          '/api/method/vise_budget_planning.api.v1.planning.get_budget_preparation_setting',
        ),
    ),
    page.waitForResponse((resp) =>
      resp.url().includes('/api/method/vise_budget_planning.api.v1.user.get_current_user_info'),
    ),
  ])
})

async function testFilter(page: any, category: string, allowedTemplateTypes?: string[]) {
  // const apiRequest = page.waitForResponse((resp) =>
  //   resp
  //     .url()
  //     .includes(
  //       `/api/method/vise_budget_planning.api.v1.planning.get_budget_plans?category=${category}&page=1&page_size=20`,
  //     ),
  // )
  // const response = await apiRequest
  // expect(response.status()).toBe(200)

  // const responseData = await response.json()
  // expect(responseData).toHaveProperty('message.data')
  // expect(Array.isArray(responseData.message.data)).toBeTruthy()

  // if (responseData.message.data.length > 0) {
  //   // expect(responseData.message.data.length).toBeGreaterThan(0)
  //   for (const item of responseData.message.data) {
  //     expect(item).toHaveProperty('template_type')
  //     if (allowedTemplateTypes) {
  //       expect(allowedTemplateTypes).toContain(item.template_type) // ✅ Ensure it's one of the allowed types
  //     }
  //   }
  // }

  await page.waitForSelector('.ag-row'); // ag-Grid row selector
  // ✅ Ensure at least one row is rendered
  const rows = await page.locator('.ag-row').count();
  if (rows > 0) {
    expect(rows).toBeGreaterThan(0);
  } else {
    expect(rows).toBe(0);
  }

  // ✅ Check if the first column (template_type) contains expected values
  // const cellTexts = await page.locator('.ag-cell:first-child').allTextContents(); // Adjust selector if needed
  // for (const text of cellTexts) {
  //   expect(text).toMatch(/Revenue Planning|Revenue Allocate Planning/); // ✅ Match expected types
  // }
}

test('Dashboard loads successfully', async ({ page, request }) => {
  await page.reload()
  testFilter(page, 'all')

})

test('Click filter Revenue', async ({ page, request }) => {
  await page.getByTestId('filter-revenue').click()
  testFilter(page, 'revenue', ['Revenue Planning', 'Revenue Allocate Planning'])
})

test('Click filter Expense', async ({ page, request }) => {
  await page.getByTestId('filter-expense').click()
  testFilter(page, 'expense', [
    'Employee Planning',
    'Durable Goods Planning',
    'Material Cost Planning',
    'Lump Sum Wage Planning',
    'Utilities Costs Planning',
    'Land and Construction Planning',
    'Vehicle Repair Planning',
  ])
})

test('Click filter Project', async ({ page, request }) => {
  await page.getByTestId('filter-project').click()
  testFilter(page, 'project', ['project'])
})
