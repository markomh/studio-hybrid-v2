# F1-5 Layout, renderer SVG, dan cangkang kanvas minimal
**Tujuan:** Dokumen tampil di kanvas dari hasil layout, bisa menambah dan memindah teks.
**Boleh disentuh:** `packages/core/src/layout`, `apps/web/src/canvas`, `apps/web/src/shell` (kerangka saja), `apps/web/src/i18n`.
**Dilarang:** menghitung pemenggalan teks di komponen; memakai `type ===` di UI.
**Isi:** `layout(doc, pageId)` → primitif `TextLine` dan `Rect` dalam mm; komponen `<PageSvg>`; tombol "Tambah teks"; seret untuk memindah; header dengan status simpan dari F1-3; Undo/Redo dari F1-2.
**Kriteria penerimaan:**
- `layout.test.ts`: teks pada (20, 30) mm menghasilkan garis pertama pada koordinat yang dihitung dari metrik font; hasil stabil.
- `canvas.test.tsx`: `<PageSvg>` merender jumlah `<text>`/`<tspan>` sama dengan jumlah garis dari `layout`; tidak ada pemenggalan di komponen.
- Seret elemen 10 mm mengubah `x` tepat 10 mm pada zoom apa pun (uji zoom 50% dan 200%).
- `pnpm lint` lulus tanpa percabangan tipe di UI.
**Di luar cakupan:** tipe elemen lain, Inspector, floating bar lengkap.
**Bukti:** output Vitest; satu tangkapan layar.
