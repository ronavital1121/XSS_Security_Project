// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './playwright-tests',
  timeout: 10000,
  expect: {
    timeout: 5000,
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 60 * 1000, // increased to 60s
  },
});
