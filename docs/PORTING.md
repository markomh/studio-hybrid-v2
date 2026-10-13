# PORTING: apa yang dipindah dari v1

Rujukan v1 ada di `docs/legacy-src/` (diambil dari tag `v1-final`; langkah penyalinan di `docs/MIGRASI.md`). Folder itu **baca-saja**: tidak dikompilasi, tidak di-lint, dilarang diimpor. Pindahkan hanya logika murni dengan **menulis ulang** di `packages/core` dan menulis tesnya.

| Dari `docs/legacy-src/` | Ke v2 | Catatan |
| :--- | :--- | :--- |
| `mazeGenerator.ts` | `core/puzzles/maze` | Hanya Recursive Backtracker yang ada di v1. Algoritma lain ditambah bila diimplementasikan dan dites |
| `wordSearchGenerator.ts` | `core/puzzles/wordsearch` | v1 memakai `Math.random`; v2 wajib seed |
| `sudokuGenerator.ts` | `core/puzzles/sudoku` | v1 tanpa uji keunikan; v2 wajib solusi tunggal |
| `kdpCalculator.ts` | `core/book/kdp` | Tabel gutter jadi data; cek ulang ke panduan KDP terbaru |
| `paginationEngine.ts` | `core/book/pagination` | Dengan tes recto/verso |
| `fontResolver.ts` | `core/fonts` | Ganti ke embed TTF penuh untuk semua keluarga font |
| `ElementRegistry.ts`, `types.index.ts` | `core/registry`, `core/schema` | Hanya konsep dan nama tipe; tulis ulang |
| `docs/legacy/*.md` (audit, kontrak, zonasi) | `docs/` | Nilai kapabilitas sudah ada di `DATA_MODEL.md` |

**Tidak dipindahkan:** `App.tsx`, `CanvasWorkspace.tsx`, model halaman warisan, riwayat snapshot, modal ekspor, teks "Lolos Preflight", endpoint AI.

**Aturan:**
- Setiap fungsi yang dipindah harus punya tes sebelum dianggap selesai (mis. seed sama menghasilkan hasil sama; solusi labirin valid dari start ke finish).
- Jangan menyalin gaya atau struktur v1 hanya karena ada. Jika v1 dan kartu bertentangan, kartu menang.
- `docs/legacy-src/` dihapus setelah fase 2 selesai.
