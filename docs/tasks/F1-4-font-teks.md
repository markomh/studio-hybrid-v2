# F1-4 Font dibundel, pengukuran dan pemenggalan teks
**Tujuan:** Satu mesin ukur teks yang dipakai kanvas dan PDF.
**Boleh disentuh:** `packages/core/src/fonts`, `packages/core/src/text`, tes.
**Dilarang:** memuat font dari CDN; memakai API DOM.
**Isi:** bundel TTF OFL untuk sans, serif, comic, mono (regular, bold, italic bila ada) beserta berkas lisensi; `measureText`, `wrapText(text, font, sizePt, widthMm, letterSpacing)` mengembalikan baris dengan lebar tiap baris.
**Kriteria penerimaan:**
- `fonts.test.ts`: tiap keluarga font punya berkas TTF dan berkas lisensi; `grep -r "http" core/src/fonts` tidak menemukan URL.
- `wrap.test.ts`: teks pendek satu baris; teks panjang terpecah tanpa baris melebihi lebar kotak; kata tunggal yang lebih panjang dari kotak dipecah dan ditandai `overflow`.
- Teks Indonesia dengan angka, tanda kutip tipografis, dan huruf kapital menghasilkan glyph (tidak ada notdef).
- Hasil `wrapText` deterministik (dua kali panggilan sama).
**Di luar cakupan:** rendering.
**Bukti:** output Vitest; daftar lisensi font.
