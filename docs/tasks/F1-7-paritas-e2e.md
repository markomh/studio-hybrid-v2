# F1-7 Tes paritas dan e2e
**Tujuan:** Membuktikan janji "yang terlihat = yang tercetak" dan "tidak ada kerja hilang".
**Boleh disentuh:** `packages/core/test/parity`, `apps/web/e2e`.
**Isi dan kriteria penerimaan:**
- `parity.test.ts`: untuk tiga format (letter, a4, 6x9) dan tiga keluarga font, posisi tiap garis teks di PDF (diekstrak dengan `pdfjs-dist`) berbeda ≤ 0,5 mm dari primitif `layout`.
- `e2e/basic.spec.ts` (Playwright): buat dokumen → tambah teks → ubah isi → reload → teks masih ada → Undo → teks kembali ke keadaan semula → ekspor PDF berhasil diunduh.
- `e2e/save-status.spec.ts`: dengan penyimpanan disimulasikan gagal, indikator menampilkan galat dan **tidak** menampilkan "Tersimpan".
**Di luar cakupan:** tipe elemen lain.
**Bukti:** laporan Playwright dan Vitest.
