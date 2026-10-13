# F1-2 Store dan riwayat
**Tujuan:** Satu jalur mutasi dengan Undo/Redo dari patch.
**Boleh disentuh:** `apps/web/src/store`, tes di `apps/web/test/store`.
**Dilarang:** memutasi dokumen di luar aksi store; menyimpan data biner di riwayat.
**Isi:** Zustand + Immer; aksi `addElement`, `updateElement`, `moveElement`, `deleteElement`; `transaction(label, fn)`; `undo()`, `redo()`; batas riwayat 100.
**Kriteria penerimaan:**
- `history.test.ts`: tiap aksi menambah satu entri; `undo` lalu `redo` mengembalikan dokumen identik (`toEqual`).
- `transaction` dengan tiga perubahan menghasilkan **satu** entri Undo.
- Aksi baru setelah `undo` membersihkan riwayat redo.
- Mutasi langsung pada state (tanpa aksi) memicu galat pada mode pengembangan (Immer auto-freeze).
**Di luar cakupan:** penyimpanan, UI.
**Bukti:** output Vitest.
