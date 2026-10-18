# F3-B7 Shape dan unggah gambar
**Tujuan:** Dua tipe baru yang lulus aturan tipe baru: registry, kapabilitas, render vektor, paritas PDF.
**Prasyarat:** B1 sampai B3, F2-8 (primitif gambar), F1-3 (penyimpanan aset).
**Boleh disentuh:** `packages/core/src/registry`, `packages/core/src/layout`, `packages/core/src/pdf`, `packages/core/src/image` (validasi, DPI), `apps/web/src/persistence` (aset), `apps/web/src/shell` (palet), tes.
**Dilarang:** emoji sebagai gambar (hasil PDF tergantung font sistem); gambar sebagai data URL di dokumen atau riwayat; SVG unggahan (risiko keamanan); dependensi baru tanpa ADR.

## Shape
- Tipe `shape` (rect, ellipse, line) sesuai `DATA_MODEL.md`. Kapabilitas: rotasi, cermin, transparansi, fill, stroke; tanpa tipografi dan engine. Bidang: fill (dapat kosong), stroke, tebal garis (0,1–5 mm), solid/putus-putus, radius sudut (hanya rect, maksimum setengah sisi terpendek). Kolom cepat toolbar: fill, stroke, tebal.
- Garis: dari pojok kiri-atas ke kanan-bawah kotak elemen; cermin membalik arahnya.
- Render vektor di SVG dan PDF; opasitas diterapkan.

## Gambar
- Validasi dengan **magic bytes**, bukan ekstensi: hanya PNG dan JPEG, maksimal 5 MiB. Menolak SVG, GIF, WebP, dan berkas lain dengan pesan dari kamus. Ukuran piksel dibaca dari berkas.
- Aset disimpan sebagai Blob di tabel `assets` dengan id = SHA-256 isi (berkas sama = satu rekaman). Dokumen dan riwayat hanya menyimpan `assetId`.
- Elemen baru berukuran sesuai rasio, lebar awal ≤ 60% lebar area konten, `fit: 'contain'`. Inspector: fit (contain/cover/stretch), cermin, transparansi, rotasi. **Crop menyusul** (V2.1).
- `effectiveDpi(element, asset)` murni; Inspector menampilkan peringatan bila < 300 dpi.
- PDF menyisipkan gambar pada ukuran piksel aslinya, tanpa penurunan resolusi. Konversi grayscale gambar menyusul di fase 4 (ekspor).
- Aset ikut dalam cadangan `.shbook`. Aset hilang tidak membuat aplikasi gagal: tampil kotak pengganti "Gambar hilang".
**Kriteria penerimaan:**
- `shape.capabilities.test.ts` dan `image.capabilities.test.ts`: kapabilitas sama persis dengan tabel di `DATA_MODEL.md`.
- `shape.layout.test.ts`: rect berradius → primitif `Rect` dengan radius; ellipse; garis dari (x,y) ke (x+w,y+h), cermin menukar arah; fill kosong → tanpa isian; tebal garis dalam mm; deterministik.
- `shape.pdf.test.ts`: tidak ada gambar raster pada halaman; posisi ≤ 0,05 mm dari layout; garis putus-putus dan opasitas tercermin pada stream.
- `image.validate.test.ts`: PNG dan JPEG diterima walau ekstensi salah; berkas teks berekstensi `.png` ditolak; 5 MiB + 1 byte ditolak; SVG, GIF, WebP ditolak; mengembalikan lebar dan tinggi benar.
- `assets.db.test.ts` (fake-indexeddb): berkas sama diunggah dua kali = satu rekaman dengan id sama.
- `image.history.test.ts`: menambah gambar 2 MB menghasilkan patch riwayat < 4 KB.
- `imageDpi.test.ts`: 1200 px pada 50,8 mm = 600 dpi; 300 px pada 50,8 mm = 150 dpi dan memicu peringatan; rotasi tidak mengubah nilai.
- `image.pdf.test.ts`: dimensi piksel gambar dalam PDF sama dengan berkas asli (tidak diperkecil); posisi ≤ 0,05 mm dari layout; cermin dan transparansi berlaku.
- `image.missing.test.ts`: elemen dengan `assetId` yang tidak ada tampil kotak pengganti, tidak melempar galat, dan PDF tetap terekspor.
- `backup.assets.test.ts`: ekspor lalu impor `.shbook` mengembalikan aset dengan SHA-256 sama.
- Playwright `shape-image.spec.ts`: unggah PNG 600×400 → tampil → muat ulang tetap ada → ekspor PDF memuat gambar; unggah berkas tak valid menampilkan pesan tanpa mengubah dokumen; tambah ketiga bentuk dari panel; axe tanpa pelanggaran serius.
- Panel Elemen (B6) menampilkan kategori Bentuk dan Gambar otomatis dari registry tanpa mengubah kode panel.
- `pnpm check` hijau.
**Di luar cakupan:** crop, filter, grayscale gambar, clipart SVG bundel (D-10), mask.
**Bukti:** output tes dan tangkapan layar.
