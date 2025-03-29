import { test, expect } from '@playwright/test';

test.describe('Create Plan Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the create plan page before each test
    await page.goto('/plan/create');
  });

  test('should display the main title', async ({ page }) => {
    const title = page.getByText('แผนงบประมาณ');
    await expect(title).toBeVisible();
  });

  test('should display revenue section with correct items', async ({ page }) => {
    // Check section title
    const revenueTitle = page.getByText('รายได้/รายรับ (Revenue)');
    await expect(revenueTitle).toBeVisible();

    // Check revenue items
    const revenueItems = [
      { title: 'รายได้', description: 'การคาดการณ์รายได้จากแหล่งต่างๆ ที่องค์กรจะได้รับ' },
      { title: 'รายได้จัดสรร', description: 'การคาดการณ์รายได้จากแหล่งต่างๆ ที่องค์กรจะได้รับ' }
    ];

    for (const item of revenueItems) {
      const card = page.getByTestId(`card-${item.title}`);
      await expect(card).toBeVisible();
      await expect(card.getByText(item.description)).toBeVisible();
    }
  });

  test('should display expense section with correct items', async ({ page }) => {
    // Check expense items
    const expenseItems = [
      { title: 'งบบุคลากร', description: 'ประมาณการรายจ่ายเพื่อการบริหารงานบุคลากรภาครัฐ' },
      { title: 'ค่าซ่อมแซม', description: 'ค่าช่วยเหลือและผลตอบแทนสำหรับการดำเนินกิจการ' },
      { title: 'ครุภัณฑ์', description: 'ค่าจัดหาครุภัณฑ์ต่างๆภายในองค์กรและเครื่องมือ' },
      { title: 'ค่าวัสดุ', description: 'ค่าใช้จ่ายเกี่ยวกับงานวิจัยที่ใช้ในการดำเนินงาน' },
      { title: 'ค่าสาธารณูปโภค', description: 'ค่าใช้จ่ายเกี่ยวกับสาธารณูปโภค น้ำ ไฟ' },
      { title: 'ที่ดินและสิ่งก่อสร้าง', description: 'ค่าใช้จ่ายเกี่ยวกับที่ดินและสิ่งก่อสร้างอาคาร' },
      { title: 'ค่าจ้างเหมา', description: 'ค่าใช้จ่ายการจ้างบุคคลภายนอกทำงาน' }
    ];

    for (const item of expenseItems) {
      const card = page.getByTestId(`card-${item.title}`);
      await expect(card).toBeVisible();
      await expect(card.getByText(item.description)).toBeVisible();
    }
  });

  test('should open dialog when clicking on a card', async ({ page }) => {
    // Click on the first revenue card
    const revenueCard = page.getByTestId('card-รายได้');
    await revenueCard.click();

    // Verify dialog opens
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Verify dialog title content
    const dialogTitle = dialog.locator('.MuiDialogTitle-root');
    await expect(dialogTitle.locator('h5')).toContainText('รายได้');
    await expect(dialogTitle.locator('span')).toContainText('การคาดการณ์รายได้จากแหล่งต่างๆ ที่องค์กรจะได้รับ');

    // Verify dialog buttons
    await expect(dialog.getByRole('button', { name: 'ยกเลิก' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'ตกลง' })).toBeVisible();
  });

  test('should close dialog when clicking cancel', async ({ page }) => {
    // Open dialog
    const revenueCard = page.getByTestId('card-รายได้');
    await revenueCard.click();

    // Click cancel button
    const cancelButton = page.getByRole('button', { name: 'ยกเลิก' });
    await cancelButton.click();

    // Verify dialog is closed
    const dialog = page.getByRole('dialog');
    await expect(dialog).not.toBeVisible();
  });

  test('should navigate to new plan page when submitting form', async ({ page }) => {
    // Open dialog
    const revenueCard = page.getByTestId('card-รายได้');
    await revenueCard.click();

    // Click submit button
    const submitButton = page.getByRole('button', { name: 'ตกลง' });
    await submitButton.click();

    // Verify navigation to new plan page
    await expect(page).toHaveURL(/.*\/plan\/revenue\/new/);
  });
}); 