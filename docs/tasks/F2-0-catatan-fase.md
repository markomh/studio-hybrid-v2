# Fase 2 — Pindahkan generator puzzle (catatan sebelum mulai)

**Prasyarat:** fase 1 selesai (kartu F1-7 lulus).
**Tujuan fase:** empat jenis puzzle (maze, wordsearch, sudoku, worksheet) menjadi fungsi murni deterministik di `core`, tampil di kanvas dan PDF dari hasil layout yang sama, dapat diacak ulang (satu entri Undo), dan punya kunci jawaban yang diturunkan, bukan disalin.

## Temuan dari kode v1 yang membentuk kartu-kartu ini
| Temuan v1 | Konsekuensi di v2 |
| :--- | :--- |
| Hanya labirin yang memakai seed; Word Search dan Sudoku memakai `Math.random()` | Semua generator wajib menerima seed dan deterministik (F2-1 sampai F2-5) |
| Labirin: `seed || Math.random()` sehingga seed 0 menjadi acak | Seed 0 harus valid dan deterministik |
| Hanya Recursive Backtracker yang ada, padahal tipe menyebut `kruskal` dan `prim` | Enum hanya berisi algoritma yang diimplementasikan dan dites |
| Sudoku tidak memeriksa keunikan solusi | Puzzle wajib solusi tunggal (F2-4) |
| Clue Sudoku di kode 38/30/26/22; dokumen fitur menyebut 36/30/24 | **Keputusan produk:** pakai 36/30/24. Nilai ada di satu konstanta; ubah bila Anda memutuskan lain |
| Worksheet di v1 bergantung pada endpoint AI | Generator matematika deterministik tanpa AI (F2-5). AI boleh ditambah kemudian sebagai tambahan, bukan syarat |
| Kunci jawaban PDF hanya untuk labirin; solusi disalin ke halaman baru | Solusi diturunkan dari puzzle sumber (F2-10) |

## Aturan khusus fase 2
- Hasil generator **tidak disimpan** di dokumen; hanya `(params, seed)`. Hasil dihitung ulang dan di-cache di memori.
- Setiap generator berada di `packages/core/src/puzzles/<nama>` dengan `index.ts` yang mengekspor fungsi `generate` dan tipe hasil, tanpa efek samping.
- Dilarang memakai `Math.random`, `Date.now`, atau sumber acak lain di `core/puzzles`. Aturan ESLint dipasang di F2-1.
- Tulis ADR-0009 sebelum F2-10 (lihat kartunya).
