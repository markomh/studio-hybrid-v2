import { test, expect } from '@playwright/test';

test.describe('E2E Basic Workflow (F1-7)', () => {
  test('buat dokumen -> tambah teks -> ubah isi -> reload -> teks masih ada -> Undo -> teks kembali -> ekspor PDF', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Tambah teks
    const btnAddText = page.locator('[data-testid="btn-add-text"]');
    await expect(btnAddText).toBeVisible();
    await btnAddText.click();

    // Verifikasi teks muncul di kanvas SVG
    const textLocator = page.locator('svg text').first();
    await expect(textLocator).toBeVisible();
    await expect(textLocator).toContainText('Ketik teks di sini...');

    // 2. Ubah isi teks
    const input = page.locator('[data-testid="input-element-text"]');
    await expect(input).toBeVisible();
    await input.fill('Teks Baru Hasil Edit');

    // Kanvas segera menampilkan teks baru
    await expect(textLocator).toContainText('Teks Baru Hasil Edit');

    // Tunggu status simpan menjadi "Tersimpan"
    const statusIndicator = page.locator('[data-testid="save-status-indicator"]');
    await expect(statusIndicator).toHaveText('Tersimpan', { timeout: 5000 });

    // 3. Reload browser
    await page.reload();

    // 4. Teks masih ada setelah reload
    const reloadedText = page.locator('svg text').first();
    await expect(reloadedText).toBeVisible();
    await expect(reloadedText).toContainText('Teks Baru Hasil Edit');

    // 5. Undo perubahan
    const btnUndo = page.locator('[data-testid="btn-undo"]');
    await expect(btnUndo).toBeEnabled({ timeout: 5000 });
    await btnUndo.click();

    // Teks kembali ke keadaan semula
    await expect(page.locator('svg text').first()).toContainText('Ketik teks di sini...');

    // 6. Ekspor PDF berhasil
    const btnExport = page.locator('[data-testid="btn-export-pdf"]');
    await expect(btnExport).toBeVisible();
    await btnExport.click();
  });
});
