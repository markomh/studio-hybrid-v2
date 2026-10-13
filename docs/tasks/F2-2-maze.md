# F2-2 Generator labirin
**Tujuan:** Labirin sempurna, deterministik, dengan solusi yang valid.
**Rujukan:** `src/utils/mazeGenerator.ts` di repo v1 (hanya sebagai referensi).
**Boleh disentuh:** `packages/core/src/puzzles/maze`, tes.
**Dilarang:** menyimpan hasil di dokumen; memakai acak selain `rng`.
**Isi:** `generateMaze({rows, cols, algorithm, seed, startCorner, finishCorner})` → `{cells, solutionPath, start, finish}`. Implementasikan `recursive-backtracker`, `prim`, dan `kruskal`. Solusi dicari dengan BFS. Batas ukuran: 2–60 baris dan kolom.
**Kriteria penerimaan:**
- `maze.test.ts` untuk **setiap algoritma**: labirin sempurna (jumlah celah dinding yang dibuka = `rows*cols - 1`; semua sel terhubung; tidak ada siklus).
- Seed sama menghasilkan labirin identik (`toEqual`); seed berbeda menghasilkan labirin berbeda; seed 0 valid.
- `solutionPath` mulai di `start`, berakhir di `finish`, setiap langkah berpindah satu sel tetangga tanpa menembus dinding, dan panjangnya sama dengan jalur terpendek hasil BFS independen di tes.
- Pojok awal dan akhir sesuai konfigurasi; `random` dibaca dari `rng` dengan seed turunan sehingga hasil stabil.
- Ukuran di luar batas menghasilkan galat bertipe, bukan hasil rusak.
**Di luar cakupan:** layout dan render.
**Bukti:** output Vitest (tiga algoritma terpisah).
