# F2-9 Aksi store untuk puzzle (acak ulang dan solusi)
**Tujuan:** Mengacak ulang dan menampilkan jawaban lewat jalur mutasi tunggal.
**Boleh disentuh:** `apps/web/src/store`, tes.
**Dilarang:** memanggil generator dari komponen; menyimpan hasil generator di store.
**Isi:** `addPuzzle(kind, pageId)`, `regeneratePuzzle(elementId)` (seed baru dari `rng` yang di-seed dengan `crypto.getRandomValues`, disimpan di dokumen), `toggleSolution(elementId)`, `updatePuzzleParams(elementId, partial)` dengan validasi dari registry.
**Kriteria penerimaan:**
- `puzzle-actions.test.ts`: `regeneratePuzzle` mengubah hanya `seed` dan menghasilkan satu entri Undo; Undo mengembalikan seed lama dan layout identik dengan sebelumnya.
- `toggleSolution` satu entri Undo.
- `updatePuzzleParams` dengan nilai tidak valid (mis. kata terlalu panjang) ditolak dengan pesan dan tidak mengubah dokumen.
- Tidak ada properti puzzle lain (mis. `mazeConfig` pada elemen wordsearch) yang muncul setelah rangkaian aksi acak (tes properti: 200 aksi acak, lalu validasi skema).
**Di luar cakupan:** UI.
**Bukti:** output Vitest.
