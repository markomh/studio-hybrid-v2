# F3-A5 Viewport kanvas dan garis bantu
**Tujuan:** Halaman tampil terpusat, bisa di-zoom dan digeser, dengan garis bantu cetak yang akurat.
**Rujukan visual:** `docs/ui-ref/v1-editor-teks.png` (halaman, garis margin, bleed).
**Boleh disentuh:** `apps/web/src/canvas`, `packages/core/src/book/margins.ts`, tes.
**Dilarang:** menghitung margin di komponen; garis bantu yang ikut ke PDF.
**Isi:**
- `computeMargins(doc, pageIndex)` di `core/book`: mengembalikan `{topMm, bottomMm, leftMm, rightMm}` dengan margin dalam di sisi dalam sesuai recto/verso.
- Zoom (kontrol footer, `Ctrl`+roda) dan pan (spasi+seret atau roda). Halaman terpusat dengan latar netral; bayangan halus.
- Garis bantu (dapat disembunyikan): batas trim, bleed (garis merah putus-putus), margin aman (garis biru putus-putus), label kecil di luar halaman (tidak menimpa seleksi).
- Petunjuk "Tambah elemen dari panel kiri" sebagai **overlay** yang hilang saat ada elemen dan **tidak ikut ekspor**.
**Kriteria penerimaan:**
- `margins.test.ts`: halaman 1 (recto) dan 2 (verso) menukar margin dalam dan luar; margin sama dengan nilai dokumen.
- Playwright: koordinat garis margin di layar sama dengan `margin_mm × skala` (toleransi 1 px) pada zoom 50%, 100%, 200%.
- Garis bantu bleed berada tepat `bleedMm` di luar trim.
- Ekspor PDF halaman kosong tidak memuat garis bantu maupun teks petunjuk (periksa operator halaman).
- Pan dan zoom tidak mengubah dokumen (`toEqual`) dan tidak menambah entri Undo.
- `pnpm check` hijau.
**Di luar cakupan:** penggaris, snapping, seleksi.
**Bukti:** output tes dan tangkapan layar tiga zoom.
