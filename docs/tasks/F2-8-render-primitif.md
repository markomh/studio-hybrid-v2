# F2-8 Renderer SVG dan PDF untuk primitif gambar
**Tujuan:** Primitif baru tampil sama di kanvas dan PDF, sebagai vektor.
**Boleh disentuh:** `apps/web/src/canvas`, `packages/core/src/pdf`, tes paritas.
**Dilarang:** logika tata letak di renderer; rasterisasi puzzle.
**Isi:** terjemahkan `Line`, `Path`, `Rect`, `Ellipse` ke SVG dan pdf-lib; dukung tebal garis mm, ujung garis bulat, putus-putus, dan mode grayscale untuk PDF.
**Kriteria penerimaan:**
- `pdf.vector.test.ts`: PDF halaman berisi tiap puzzle tidak memuat gambar raster (tidak ada objek `Image` pada daftar operator halaman).
- `parity.puzzle.test.ts`: koordinat ujung segmen dinding di PDF berbeda ≤ 0,05 mm dari primitif layout; ketebalan garis sama dalam 0,01 mm.
- `canvas.test.tsx`: jumlah elemen `<line>`/`<path>` pada SVG sama dengan jumlah primitif layout.
- Mode grayscale mengubah warna dinding dan solusi menjadi abu-abu pada PDF; kanvas tidak berubah.
- Ukuran berkas PDF sebuah halaman maze 40×40 di bawah 200 KB.
**Di luar cakupan:** gambar raster, font tambahan.
**Bukti:** output Vitest; satu tangkapan layar kanvas dan PDF berdampingan per puzzle.
