# F1-6 Renderer PDF untuk teks
**Tujuan:** PDF dibuat dari primitif layout yang sama, dengan font ter-embed.
**Boleh disentuh:** `packages/core/src/pdf`, tes.
**Dilarang:** mengukur atau memenggal teks di renderer PDF; memakai font inti PDF untuk teks dokumen.
**Isi:** `renderPdf(doc, options)` dengan pdf-lib + fontkit; ukuran halaman = trim + bleed bila diminta; menggambar `TextLine` pada koordinat mm; opsi `grayscale`.
**Kriteria penerimaan:**
- `pdf.test.ts`: jumlah halaman PDF = jumlah halaman dokumen; ukuran halaman sama dengan trim (toleransi 0,01 mm).
- `pdffonts` (atau `pdfjs-dist`) pada PDF hasil menunjukkan semua font **ter-embed** dan tidak ada Helvetica untuk teks dokumen.
- Mode `grayscale` mengonversi warna teks berwarna menjadi abu-abu (periksa nilai warna di stream).
- Dua kali render dokumen yang sama menghasilkan teks dan posisi yang sama.
**Di luar cakupan:** puzzle, shape, gambar, cover.
**Bukti:** output Vitest dan `pdffonts`.
