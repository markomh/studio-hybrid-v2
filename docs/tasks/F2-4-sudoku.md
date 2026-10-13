# F2-4 Generator Sudoku
**Tujuan:** Sudoku 9×9 valid dengan solusi tunggal dan jumlah petunjuk sesuai tingkat.
**Rujukan:** `src/utils/sudokuGenerator.ts` (v1; acak tanpa seed, tanpa uji keunikan).
**Boleh disentuh:** `packages/core/src/puzzles/sudoku`, tes.
**Isi:** `generateSudoku({difficulty, seed})` → `{puzzle, solution}` (matriks 9×9, 0 = kosong). Papan penuh dibangkitkan dengan backtracking ber-seed. Penghapusan sel satu per satu dengan **penyelesai penghitung solusi** (berhenti di 2); sel dikembalikan bila solusi tidak lagi tunggal. Konstanta tunggal `CLUES = {easy: 36, medium: 30, hard: 24}`. Bila jumlah petunjuk target tidak tercapai dengan solusi tunggal, kembalikan jumlah terdekat dan sertakan `actualClues`.
**Kriteria penerimaan:**
- `sudoku.test.ts`: `solution` valid (setiap baris, kolom, dan blok 3×3 berisi 1–9 sekali).
- `puzzle` konsisten dengan `solution` (sel terisi sama).
- Penyelesai independen di tes menemukan **tepat satu** solusi untuk 20 seed berbeda pada tiap tingkat.
- `actualClues` sama dengan konstanta tingkat untuk ≥ 18 dari 20 seed; sisanya berbeda paling banyak 2.
- Seed sama menghasilkan puzzle identik; seed 0 valid.
- Waktu generate ≤ 500 ms per puzzle pada tingkat `hard` (rata-rata 20 seed).
**Di luar cakupan:** tingkat `expert`.
**Bukti:** output Vitest, termasuk ringkasan `actualClues`.
