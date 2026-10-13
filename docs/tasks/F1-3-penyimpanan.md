# F1-3 Penyimpanan Dexie dan status jujur
**Tujuan:** Data bertahan setelah reload; status simpan mencerminkan kenyataan.
**Boleh disentuh:** `apps/web/src/persistence`, tes terkait (gunakan `fake-indexeddb`).
**Dilarang:** menampilkan "Tersimpan" dari state lain selain hasil transaksi tulis.
**Isi:** tabel `projects` dan `assets`; `saveDocument`, `loadDocument`, `listProjects`; autosave debounce 800 ms; status `idle | saving | saved | error`; `requestPersistentStorage()`; ekspor dan impor `.shbook`.
**Kriteria penerimaan:**
- `persistence.test.ts`: simpan lalu muat menghasilkan dokumen yang sama; dokumen yang gagal skema tidak menimpa data lama dan mengembalikan galat.
- Status menjadi `saving` saat perubahan, `saved` hanya setelah tulis sukses, `error` saat tulis gagal (simulasikan kegagalan).
- Ekspor lalu impor `.shbook` mengembalikan dokumen dan aset identik.
- Banyak perubahan cepat menghasilkan satu tulis (debounce).
**Di luar cakupan:** sinkron cloud, UI daftar proyek.
**Bukti:** output Vitest.
