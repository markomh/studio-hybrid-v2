# F2-7 Layout puzzle menjadi primitif
**Tujuan:** Setiap puzzle menghasilkan primitif gambar dalam mm yang sama untuk kanvas dan PDF.
**Boleh disentuh:** `packages/core/src/layout`, `packages/core/src/registry` (fungsi `layout` per tipe), tes.
**Dilarang:** menghitung ukuran sel di renderer; memakai API DOM.
**Isi:** perluas primitif: `Line`, `Path`, `Rect`, `Ellipse` (bila belum ada) dengan gaya (warna, tebal mm, putus-putus). `layout` per puzzle: ukuran sel = `min(w/cols, h/rows)`, grid dipusatkan di kotak elemen, tidak melewati batas kotak. Maze: garis dinding dan ikon start/finish; solusi sebagai `Path` bila `showSolution`. Wordsearch: huruf per sel sebagai `TextLine`; solusi menandai kata dengan kapsul/garis. Sudoku: garis tipis tiap sel dan garis tebal tiap blok 3×3; angka petunjuk. Worksheet: nomor, soal, dan garis jawaban.
**Kriteria penerimaan:**
- `layout.maze.test.ts`: jumlah segmen dinding sama dengan jumlah dinding tertutup pada hasil generator (hitung independen); seluruh primitif berada dalam kotak elemen (toleransi 1e-6).
- `showSolution = true` menambah tepat satu `Path` solusi; `false` tidak ada.
- Sudoku memiliki 4 garis tebal vertikal dan 4 horizontal; jumlah angka = `actualClues` (atau 81 saat solusi).
- Wordsearch: jumlah `TextLine` = `size²`; huruf pada tiap sel sama dengan `grid`.
- Layout deterministik: dua pemanggilan menghasilkan `toEqual`.
- Ukuran sel di bawah minimum (konstanta `MIN_CELL_MM`) tidak mengubah geometri, tetapi menambahkan peringatan pada hasil layout untuk dipakai preflight (F2-11).
**Di luar cakupan:** renderer.
**Bukti:** output Vitest.
