# F2-11 Aturan preflight untuk puzzle
**Tujuan:** Masalah cetak puzzle terdeteksi oleh fungsi murni, bukan teks statis.
**Boleh disentuh:** `packages/core/src/preflight`, tes.
**Dilarang:** pesan "lolos" yang tidak berasal dari hasil aturan.
**Isi:** aturan baru dengan kode, tingkat, pesan Indonesia, dan petunjuk perbaikan:
- `maze_cell_too_small` (peringatan): ukuran sel < `MIN_CELL_MM`.
- `wordsearch_word_skipped` (galat): ada kata di `skipped`.
- `wordsearch_cell_too_small` (peringatan): huruf lebih kecil dari ukuran terbaca (`MIN_LETTER_PT`).
- `sudoku_clues_off_target` (info): `actualClues` berbeda dari target.
- `solutions_missing` (galat): buku memiliki bagian solusi tetapi ada puzzle tanpa pasangan.
- `solution_orphan` (galat): elemen `mirrorOf` menunjuk sumber yang hilang.
- `worksheet_empty` (galat): tidak ada soal.
**Kriteria penerimaan:**
- `preflight.puzzle.test.ts`: setiap aturan punya satu dokumen fixture yang memicunya dan satu yang tidak.
- Setiap `Issue` memuat `pageId` dan `elementId` yang valid.
- Dokumen bersih (fixture) menghasilkan daftar kosong.
- Pesan tidak memuat istilah teknis mentah (tes memeriksa tidak ada kata `undefined`, `NaN`, atau nama bidang kode).
- Nilai `MIN_CELL_MM` dan `MIN_LETTER_PT` didefinisikan sekali di `core/book/print-constants.ts`, dengan komentar sumbernya dan catatan untuk dicek ulang.
**Di luar cakupan:** tampilan daftar masalah di UI (fase 4).
**Bukti:** output Vitest.
