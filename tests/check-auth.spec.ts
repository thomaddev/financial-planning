import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Auth File Check', () => {
  test('should have planner.json file', async () => {
    const authDir = 'playwright/.auth';
    const plannerFilePath = path.join(authDir, 'planner.json');

    // Check if auth directory exists
    expect(fs.existsSync(authDir)).toBeTruthy();

    // Check if planner.json exists
    expect(fs.existsSync(plannerFilePath)).toBeTruthy();

    // Check if file is not empty (at least contains {})
    const content = fs.readFileSync(plannerFilePath, 'utf-8');
    expect(content.trim()).not.toBe('');
  });
}); 