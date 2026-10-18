# F3-B6 Panel Elemen berbasis registry dan tab Bingkai
**Tujuan:** Menambah objek dan bingkai dari panel kiri tanpa daftar tertulis di kode panel.
**Rujukan visual:** `docs/ui-ref/` (panel Elemen V1).
**Prasyarat:** B3, F2-6, F2-7, F2-9.
**Boleh disentuh:** `apps/web/src/shell/left-panel`, `packages/core/src/registry` (metadata `palette`), `packages/core/src/layout/border.ts`, `apps/web/src/persistence` (tabel `settings`), tes.
**Dilarang:** daftar tipe tertulis di panel; item "Segera" untuk tipe yang belum terdaftar.
**Isi:**
- Registry menambah `palette: { category, labelKey, descriptionKey, icon, keywords[], createDefault }` per tipe. Panel Elemen merender kategori dan item **hanya dari registry**: Teka-teki, Teks (Judul halaman, Instruksi). Kategori Bentuk dan Gambar muncul setelah B7. Clipart menunggu keputusan D-10.
- Pencarian tidak peka huruf besar-kecil dan diakritik; mencocokkan label dan `keywords` (mis. "maze" menemukan Labirin, "kata" menemukan Word Search). Keadaan tanpa hasil berpesan jelas.
- Klik atau `Enter` menambah elemen pada halaman aktif dengan `createDefault`, terpilih; seret ke kanvas menaruh di posisi pointer (dalam mm, dijepit di dalam halaman). Satu entri Undo.
- Baris "Paling sering" (maksimal 4) dari hitungan pemakaian di tabel `settings` (Dexie).
- Tab **Bingkai**: Tanpa bingkai, Simple, Double, Rounded, Dots; thumbnail dirender dari `layout`; klik menerapkan ke halaman aktif; kotak centang "Terapkan ke semua halaman". Bingkai digambar di dalam margin, tidak pernah masuk ke area bleed. Konstanta jarak dan tebal ditentukan di `border.ts` dan didokumentasikan.
**Kriteria penerimaan:**
- `palette.registry.test.tsx`: item panel = himpunan entri `palette` registry (sama persis); mendaftarkan tipe palsu menambah itemnya, menghapusnya menghilangkan item, **tanpa mengubah kode panel**.
- `search.test.ts`: "labirin", "maze", "SUDOKU", dan "kata" menemukan item yang benar; kueri tanpa hasil menampilkan pesan.
- `add.test.tsx`: klik menambah elemen dengan nilai `createDefault`, terpilih, satu entri Undo; Undo menghapusnya.
- `drop.test.tsx`: drop pada titik pointer menghasilkan `x,y` sama dengan pointer dikurangi setengah ukuran (±0,01 mm), dijepit di dalam halaman.
- `usage.test.ts` (fake-indexeddb): menambah Labirin dua kali dan Teks sekali → "Paling sering" mengurutkan Labirin pertama; bertahan setelah muat ulang.
- `border.layout.test.ts`: untuk tiap gaya, semua primitif berada di dalam margin dan tidak melewati batas trim; hasil deterministik.
- `border.pdf.test.ts`: posisi bentuk bingkai di PDF berbeda ≤ 0,05 mm dari primitif layout.
- Menerapkan bingkai = satu entri Undo; "Terapkan ke semua halaman" = **satu** entri untuk seluruh halaman; Undo mengembalikan semua halaman.
- Playwright: tambah setiap item palet dari panel, terapkan setiap bingkai, ekspor PDF; navigasi panel dengan keyboard; axe tanpa pelanggaran serius.
- `pnpm check` hijau.
**Di luar cakupan:** clipart, Shape dan Gambar (B7), template halaman.
**Bukti:** output tes dan tangkapan layar.
