# F3-B4 Ubah ukuran dan rotasi
**Tujuan:** Gagang ubah ukuran dan rotasi yang akurat, dengan hasil sama di kanvas dan PDF.
**Prasyarat:** B3.
**Boleh disentuh:** `packages/core/src/geometry` (resize, rotasi), `packages/core/src/layout` dan `packages/core/src/pdf` (hanya bila rotasi belum didukung), `apps/web/src/canvas`, tes.
**Dilarang:** logika geometri di komponen (B-8); menulis ke dokumen pada setiap gerakan (B-4).
**Isi:**
- Delapan gagang. Sudut menjaga rasio aspek; `Shift` membebaskannya. Gagang tepi mengubah satu dimensi pada sumbu lokal elemen. Ukuran minimum 2 mm; ukuran tidak boleh terbalik (negatif): dijepit.
- Titik jangkar (sudut atau tepi di seberang gagang) tetap di tempat dalam koordinat dunia, juga untuk elemen berotasi.
- Gagang rotasi di atas kotak, hanya bila `capabilities.rotate`. Rotasi mengelilingi pusat elemen; `Shift` mengunci kelipatan 15°; label derajat bilangan bulat selama putar. Nilai dinormalisasi ke [0, 360).
- Ukuran visual gagang 8–10 px dan **area sentuh minimal 24×24 px**, tetap pada zoom berapa pun. Tidak ada gagang untuk elemen terkunci.
- `resizeBox(box, handle, deltaMm, options)` dan `rotationFromPointer(centerMm, pointerMm, options)` adalah fungsi murni di `core/geometry`.
- Mengubah ukuran elemen teks mengubah kotak, bukan ukuran font; teks dipenggal ulang oleh `layout`.
- Elemen berotasi tampil sama di PDF. Bila renderer PDF atau layout belum mendukung rotasi, tambahkan di kartu ini.
**Kriteria penerimaan:**
- `geometry.resize.test.ts`: untuk 8 gagang × rotasi {0°, 30°, 90°, 200°}: titik jangkar tetap (selisih ≤ 1e-6 mm); gagang sudut menjaga rasio w/h (≤ 1e-6); gagang tepi hanya mengubah satu dimensi lokal; ukuran dijepit di 2 mm dan tidak pernah negatif.
- `geometry.rotate.test.ts`: pointer di empat arah mata angin menghasilkan 0°, 90°, 180°, 270°; `Shift` menghasilkan kelipatan 15° tepat; hasil selalu dalam [0, 360).
- `handles.test.tsx`: delapan gagang tampil untuk elemen tidak terkunci; **gagang rotasi tidak ada** bila `rotate` bernilai false (tes iterasi registry); tidak ada gagang untuk elemen terkunci; area sentuh ≥ 24×24 px; label derajat menampilkan rotasi saat ini.
- Integrasi: ubah ukuran lewat pointer pada zoom 50% dan 200% menghasilkan perubahan mm yang sama; **satu entri Undo**; Undo mengembalikan kotak `toEqual` semula.
- Core: setelah teks dipersempit, `layout` mengembalikan lebih banyak baris dan semua baris tetap di dalam kotak.
- `parity.rotated.test.ts`: posisi garis teks dan bentuk di PDF untuk rotasi 0°, 30°, 90° berbeda ≤ 0,5 mm dari primitif `layout`.
- Playwright `transform.spec.ts`: seret gagang sudut dan tepi, putar dengan `Shift`; tangkapan layar baseline.
- `pnpm check` hijau.
**Di luar cakupan:** ubah ukuran grup (tidak didukung di V2), snapping.
**Bukti:** output tes dan tangkapan layar.
