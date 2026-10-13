# F0-1 Scaffold monorepo
**Tujuan:** Repo yang bisa menjalankan `pnpm check`, dengan rujukan v1 terisolasi.
**Prasyarat:** langkah manusia di `docs/MIGRASI.md` sudah selesai; `docs/legacy-src/` dan `docs/legacy/` sudah ada di repo.
**Boleh disentuh:** root (`package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, konfigurasi ESLint/Vitest), `packages/core`, `apps/web` (hanya kerangka).
**Dilarang:** menambah dependensi di luar daftar ADR; menyalin atau memindahkan kode dari `docs/legacy-src/` (itu tugas fase 1–2); mengubah isi `docs/legacy-src/`.
**Isi:**
- pnpm workspaces; TypeScript `strict`; Vitest; ESLint; skrip `lint`, `typecheck`, `test`, `depcheck`, `check`, `e2e` (Playwright dipasang tetapi boleh belum ada tes).
- **Pengecualian `docs/`:** `docs/**` dikecualikan dari `tsconfig` (`exclude`), ESLint (`ignores`), Vitest (`exclude`), dan dependency-cruiser (`exclude`). Isi `docs/legacy-src/` tidak boleh ikut dikompilasi, di-lint, atau dites.
**Kriteria penerimaan:**
- `pnpm install && pnpm check` hijau.
- Ada satu tes dummy di `core` dan satu di `web`; keduanya lulus.
- `tsc` gagal bila ada `any` implisit (uji dengan satu file contoh, lalu hapus).
- **Uji pengecualian:** buat sementara `docs/legacy-src/_rusak.ts` berisi `const x: number = "a"; import 'tidak-ada';`. `pnpm check` tetap hijau. Hapus file itu setelah uji.
- `git status` menunjukkan isi `docs/legacy-src/` tidak berubah.
**Di luar cakupan:** UI, skema, fitur apa pun, pemindahan kode v1.
**Bukti:** output `pnpm check` dan output uji pengecualian.
