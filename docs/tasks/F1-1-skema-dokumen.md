# F1-1 Skema dokumen, satuan, migrasi
**Tujuan:** Satu definisi dokumen yang divalidasi.
**Boleh disentuh:** `packages/core/src/schema`, `packages/core/src/units`, `packages/core/test`.
**Dilarang:** mengimpor apa pun dari `apps/web`.
**Isi:** Zod untuk `Document`, `Page`, `TextElement` (tipe lain menyusul di fase 2 tetapi union disiapkan); `createDocument(preset)`; `mmToPt`, `ptToMm`, `mmToIn`; `migrate(unknown)`; fixture dokumen valid dan tidak valid.
**Kriteria penerimaan:**
- `schema.test.ts`: dokumen valid lolos; setiap fixture tidak valid (satuan salah, opasitas > 1, peran halaman tak dikenal) ditolak dengan pesan yang menunjuk path.
- `units.test.ts`: `mmToPt(25.4) = 72`; bolak-balik tanpa selisih > 1e-9.
- `migrate.test.ts`: input tanpa `schemaVersion` ditolak; input versi 1 lewat tanpa perubahan.
- `createDocument('letter')` menghasilkan 215,9 × 279,4 mm dan bleed 3,175 mm.
**Di luar cakupan:** tipe elemen selain teks; penyimpanan.
**Bukti:** output Vitest.
