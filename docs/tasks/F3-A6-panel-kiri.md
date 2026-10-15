# F3-A6 Panel kiri: tab Halaman dan tab Elemen (teks)
**Tujuan:** Mengelola halaman dan menambah teks dari panel kiri.
**Rujukan visual:** `docs/ui-ref/v1-panel-elemen.png`.
**Boleh disentuh:** `apps/web/src/shell/left-panel`, `apps/web/src/store` (aksi halaman), tes.
**Dilarang:** logika tata letak sendiri untuk thumbnail; `type ===`; menampilkan item puzzle sebelum registry (F2-6).
**Isi:**
- Rail ikon dengan tab **Elemen** dan **Halaman** (tab Bingkai menyusul di gelombang B).
- Tab Halaman: thumbnail tiap halaman dari `layout` yang sama dengan kanvas, dirender skala kecil dan dimuat malas; halaman aktif disorot; nomor halaman; badge peran; tambah, duplikat, hapus (dengan Undo), urutkan dengan seret **dan** dengan tombol "Naikkan/Turunkan" (aksesibilitas keyboard).
- Tab Elemen: pencarian dan kategori "Teks" dengan dua entri: Judul halaman dan Instruksi/catatan. Klik menambah ke halaman aktif; seret menaruh di posisi lepas. Ukuran awal teks yang masuk akal (judul 24 pt, instruksi 12 pt) [ASUMSI; periksa agar tidak tampak raksasa seperti hasil F1-5].
**Kriteria penerimaan:**
- Vitest: aksi `addPage`, `duplicatePage`, `deletePage`, `movePage` masing-masing satu entri Undo; Undo mengembalikan urutan dan isi persis.
- Duplikat halaman memberi `id` baru untuk halaman dan semua elemen; tidak ada `id` ganda di dokumen.
- Hapus halaman terakhir ditolak dengan pesan.
- Thumbnail halaman 1 berisi jumlah teks sama dengan hasil `layout` (tidak ada logika pemenggalan di komponen).
- Playwright: tambah 3 halaman → urutkan dengan seret → reload → urutan bertahan; urutkan juga bisa dengan keyboard.
- Dokumen 50 halaman: tab Halaman dapat digulir tanpa jeda berarti (tes: waktu render awal < 500 ms dengan pemuatan malas) [ASUMSI].
- Elemen teks yang ditambah dari panel muncul di kanvas dan ikut ke PDF.
- `pnpm check` hijau.
**Di luar cakupan:** puzzle, bingkai, Shape, unggah gambar, templat halaman.
**Bukti:** output tes dan tangkapan layar.
