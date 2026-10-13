# F0-3 CI dan templat PR
**Tujuan:** Tidak ada merge tanpa `pnpm check`.
**Boleh disentuh:** `.github/workflows/ci.yml`, `.github/pull_request_template.md`.
**Isi CI:** pasang pnpm dan Node 22, `pnpm install --frozen-lockfile`, `pnpm check`, unggah laporan tes. Playwright dijalankan pada job terpisah.
**Templat PR:** nomor kartu, ringkasan, output `pnpm check`, checklist kriteria penerimaan, penyimpangan.
**Kriteria penerimaan:**
- PR contoh dengan tes gagal diblokir oleh CI (tunjukkan tangkapan layar atau tautan).
- PR dengan semua hijau lolos.
**Di luar cakupan:** deployment.
**Bukti:** tautan dua run CI.
