import { test as setup } from '@playwright/test'

const plannerFile = 'playwright/.auth/planner.json'

setup('authenticate as planner', async ({ page }) => {
  await page.goto('/')

  const isSignInVisible = await page.locator('.signin').isVisible()

  if (isSignInVisible) {
    await page.locator("[type='submit']").click()

    const isRequiredUsernameFill = await page.getByLabel('username').isVisible()
    if (isRequiredUsernameFill) {
      await page.getByLabel('username').fill(process.env.KEYCLOAK_USERNAME!)
      await page.getByLabel('password').fill(process.env.KEYCLOAK_PASSWORD!)
      await page.locator("[type='submit']").click()
      await page.context().storageState({ path: plannerFile })
      await page.waitForURL('/')
    } else {
      await page.getByRole('button', { name: 'Sign in with Keycloak' }).click()
      await page.context().storageState({ path: plannerFile })
      await page.waitForURL('/')
    }
  }
})
