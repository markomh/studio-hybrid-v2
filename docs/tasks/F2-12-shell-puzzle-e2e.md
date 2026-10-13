# F2-12 Kontrol puzzle di UI dan uji ujung ke ujung
**Tujuan:** Pengguna menambah, mengacak, mengubah, dan mengekspor puzzle; kontrol digerakkan kapabilitas.
**Boleh disentuh:** `apps/web/src/shell` (panel kiri, floating bar, Inspector), `apps/web/src/i18n`, `apps/web/e2e`.
**Dilarang:** `type ===` di UI; kontrol yang diduplikasi tanpa sinkronisasi.
**Isi:** panel kiri menambah empat puzzle; floating bar menampilkan tombol engine (label dari kapabilitas), "Tampilkan jawaban", kunci, duplikat, hapus, "•••"; Inspector menampilkan bagian Dasar (terbuka) dan Lanjutan (tertutup) dari `propertySchema`.
**Kriteria penerimaan:**
- `shell.leak.test.tsx`: memilih bergantian teks, maze, wordsearch, sudoku, worksheet: kontrol dinding hanya pada maze; tidak ada opacity atau flip pada puzzle; tombol engine memakai label yang tepat.
- Mengubah ukuran font teks lewat floating bar dan Inspector menghasilkan nilai sinkron seketika dan satu entri Undo.
- `e2e/puzzles.spec.ts`: untuk tiap jenis puzzle: tambah → Acak → Undo (tampilan kembali) → Redo → reload (masih ada) → ekspor PDF.
- `e2e/solutions.spec.ts`: buat dua maze dan satu sudoku → `generateSolutionsSection()` → ekspor PDF → halaman solusi ada → acak maze pertama → halaman solusi ikut berubah.
- `pnpm lint` tidak menemukan percabangan tipe di `apps/web`.
**Di luar cakupan:** template, preflight di UI, Shape dan gambar.
**Bukti:** laporan Playwright dan Vitest; tangkapan layar tiap puzzle di kanvas dan PDF.
