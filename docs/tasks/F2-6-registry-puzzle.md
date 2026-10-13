# F2-6 Registry, skema, dan kapabilitas puzzle
**Tujuan:** Empat puzzle terdaftar dengan kapabilitas dan skema properti yang tidak bisa menyimpang dari dokumen.
**Boleh disentuh:** `packages/core/src/registry`, `packages/core/src/schema` (menambah union puzzle), tes.
**Dilarang:** mengubah `schemaVersion` tanpa migrasi; menambah opsi enum yang tidak ada implementasinya.
**Isi:** definisi `maze`, `wordsearch`, `sudoku`, `worksheet` dengan `capabilities`, `propertySchema` (label bahasa awam, satuan mm bila relevan, validasi lintas-bidang), dan `createDefault`. `PuzzleElement` pada skema Zod sesuai `DATA_MODEL.md`.
**Kriteria penerimaan:**
- `registry.test.ts`: matriks kapabilitas semua tipe sama persis dengan tabel di `DATA_MODEL.md` (tes membaca tabel dari fixture yang disalin dan membandingkan).
- Setiap nilai `algorithm` pada enum maze punya generator yang terdaftar (tes iterasi enum).
- Setiap `propertySchema` valid (kunci unik, `min < max`, opsi tidak kosong).
- `createDefault` menghasilkan elemen yang lolos validasi skema dan memuat `seed` bukan nol yang diturunkan dari `rng`.
- Validasi lintas-bidang: kata lebih panjang dari ukuran kisi dan sel labirin di bawah ukuran minimum mengembalikan pesan Indonesia yang menyebut bidangnya.
**Di luar cakupan:** layout dan UI.
**Bukti:** output Vitest.
