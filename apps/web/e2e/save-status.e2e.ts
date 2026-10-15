import { test, expect } from '@playwright/test';

test.describe('E2E Honest Save Status (I-4, F1-3, F1-7)', () => {
  test('dengan penyimpanan disimulasikan gagal, indikator menampilkan galat dan tidak menampilkan "Tersimpan"', async ({
    page,
  }) => {
    // Buka aplikasi dengan mode simulasi gagal simpan
    await page.goto('/?simulateSaveError=true');

    // Tambah teks untuk memicu autosave
    const btnAddText = page.locator('[data-testid="btn-add-text"]');
    await expect(btnAddText).toBeVisible();
    await btnAddText.click();

    // Verifikasi indikator menampilkan galat "Gagal Menyimpan"
    const statusIndicator = page.locator('[data-testid="save-status-indicator"]');
    await expect(statusIndicator).toHaveText('Gagal Menyimpan', { timeout: 5000 });

    // Dan memastikan status TIDAK menampilkan "Tersimpan"
    await expect(statusIndicator).not.toHaveText('Tersimpan');
  });
});
