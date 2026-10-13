# F2-3 Generator Word Search
**Tujuan:** Kisi kata deterministik yang semua katanya dapat ditemukan.
**Rujukan:** `src/utils/wordSearchGenerator.ts` (v1; memakai `Math.random`).
**Boleh disentuh:** `packages/core/src/puzzles/wordsearch`, data tema, tes.
**Isi:** `generateWordSearch({size, words, allowDiagonal, allowReverse, seed})` → `{grid, placements:[{word, row, col, dir}], skipped:[{word, reason}]}`. Normalisasi kata: huruf besar, tanpa spasi, tanpa tanda diakritik; kata di luar A–Z ditolak dengan alasan. Penempatan boleh berpotongan hanya bila huruf sama. Sisa sel diisi huruf acak dari `rng`.
**Kriteria penerimaan:**
- `wordsearch.test.ts`: untuk tiap `placement`, membaca kisi dari `(row, col)` menurut `dir` menghasilkan kata tepat.
- Jika `allowDiagonal = false`, tidak ada penempatan diagonal; jika `allowReverse = false`, tidak ada arah mundur (periksa seluruh `placements`).
- Seed sama menghasilkan kisi identik; seed 0 valid.
- Kata lebih panjang dari `size` masuk `skipped` dengan alasan `too_long`; kata ganda masuk `skipped` dengan `duplicate`.
- Jika kisi terlalu sempit sehingga kata tidak muat setelah percobaan maksimum (konstanta `MAX_ATTEMPTS`), kata masuk `skipped` dengan `no_space`; fungsi tidak berputar tanpa batas (tes dengan batas waktu 1 detik).
- Kisi tidak mengandung sel kosong; ukuran 8–20.
**Di luar cakupan:** daftar tema default (boleh sebagai data terpisah di kartu ini bila singkat: minimal 5 tema × 12 kata), render.
**Bukti:** output Vitest.
