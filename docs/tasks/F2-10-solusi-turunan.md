# F2-10 Kunci jawaban yang diturunkan
**Tujuan:** Halaman solusi selalu sinkron dengan puzzle sumber tanpa menyalin data.
**Langkah pertama (wajib):** tulis `docs/adr/0009-solusi-turunan.md` (konteks, keputusan, konsekuensi) dan minta persetujuan sebelum menulis kode. Keputusan yang diusulkan: `PuzzleElement` pada halaman berperan `solutions` memuat `mirrorOf: {pageId, elementId}`; `layout` meminta parameter dan seed dari elemen sumber, lalu merender dengan `showSolution = true` dan skala yang sesuai.
**Boleh disentuh:** `packages/core/src/schema`, `packages/core/src/book`, `packages/core/src/layout`, `apps/web/src/store`, tes.
**Dilarang:** menyalin `params` atau `seed` ke elemen solusi.
**Isi:** aksi `generateSolutionsSection()` membuat halaman solusi (empat solusi per halaman, kisi 2×2) untuk semua puzzle yang `solutionKey`-nya benar; penomoran halaman memakai `book/pagination`.
**Kriteria penerimaan:**
- `solutions.test.ts`: N puzzle menghasilkan `ceil(N/4)` halaman solusi, tiap elemen memuat `mirrorOf` yang valid.
- Mengubah `seed` puzzle sumber mengubah layout solusi **tanpa aksi lain** (bandingkan primitif sebelum dan sesudah).
- Menghapus puzzle sumber membuat solusi tidak valid: `layout` tidak melempar galat dan menghasilkan penanda kosong; preflight melaporkan `solution_orphan` (F2-11).
- Menjalankan `generateSolutionsSection()` dua kali tidak menggandakan halaman (idempoten).
- Seluruh pembuatan satu bagian solusi adalah satu entri Undo.
- Skema Zod menolak `mirrorOf` yang menunjuk elemen non-puzzle.
**Di luar cakupan:** desain visual halaman solusi lanjutan.
**Bukti:** ADR-0009 yang disetujui; output Vitest.
