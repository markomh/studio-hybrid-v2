# F3-B2 Inspector dari `propertySchema`
**Tujuan:** Panel detail yang seluruh isinya digerakkan registry, dengan bagian Dasar dan Lanjutan.
**Rujukan visual:** `docs/ui-ref/` (Inspector V1: header, accordion). Bahasa label awam (mis. "Jarak antar baris").
**Prasyarat:** B1.
**Boleh disentuh:** `apps/web/src/shell/inspector`, `apps/web/src/store` (aksi halaman), `apps/web/src/i18n`, tes.
**Dilarang:** `type ===`; label tertulis langsung; menyimpan salinan nilai di state komponen (I-8).
**Isi:**
- Header: judul tipe dari registry (bukan id).
- **Dasar** terbuka, **Lanjutan** tertutup. Tiap `PropertyField` dirender menurut `kind` (slider, input angka bersatuan, pemilih warna, select, switch, textarea), dengan label dan satuan (mm, pt, °) dari kamus.
- Bidang universal berdasarkan kapabilitas: rotasi bila `rotate`, transparansi bila `opacity`, posisi dan ukuran (x, y, w, h dalam mm) di Lanjutan.
- Nilai input angka dan slider terhubung; **komit saat Enter atau blur; slider hanya saat dilepas**. Nilai di luar rentang atau gagal `validate` ditolak dengan pesan berbahasa awam; dokumen tidak berubah.
- Tombol "Atur ulang" per bagian: mengembalikan bidang bagian itu ke nilai `createDefault`.
- **Tanpa seleksi:** kartu Halaman dari dokumen nyata: ukuran trim, bleed, margin, peran halaman (dapat diubah lewat aksi `updatePage`), penomoran. **Banyak objek:** tampilkan "N objek dipilih" dan bidang yang berlaku untuk semuanya (kosong bila tidak ada).
- Dalam Mode Fokus Inspector tidak dipasang, nilai tetap utuh.
**Kriteria penerimaan:**
- `inspector.schema.test.tsx`: untuk setiap tipe terdaftar, kunci bidang yang dirender = kunci `propertySchema` + bidang universal turunan kapabilitas; bidang `advanced` berada di bagian Lanjutan yang tertutup saat awal; `kind` menghasilkan peran ARIA yang benar (`slider`, `switch`, `combobox`, `spinbutton`).
- Rotasi hanya muncul bila `capabilities.rotate`; transparansi hanya bila `capabilities.opacity` (tes iterasi).
- `inspector.sync.test.tsx`: ubah ukuran font lewat stepper toolbar → Inspector menampilkan nilai sama seketika; ubah lewat Inspector → toolbar sama; masing-masing **satu entri Undo**.
- **Slider dijatuhkan satu kali setelah 20 gerakan menghasilkan tepat satu entri Undo** (tes pointer).
- Validasi: nilai di atas `max` memunculkan pesan, `document` tetap `toEqual` semula, riwayat tidak bertambah.
- "Atur ulang" mengembalikan nilai ke `createDefault` dan merupakan satu entri Undo.
- Kartu Halaman menampilkan nilai persis dari dokumen (trim, bleed, margin); mengubah peran halaman = satu entri Undo.
- `i18n.test.ts`: tidak ada string Indonesia literal di berkas komponen Inspector.
- Playwright: Inspector tidak memicu luapan horizontal pada 1024 px; semua kontrol dapat dioperasikan dengan keyboard; axe tanpa pelanggaran serius.
- `pnpm check` hijau.
**Di luar cakupan:** pengeditan banyak objek sekaligus, panel Layer.
**Bukti:** output tes dan laporan axe, tangkapan layar tiap tipe terpilih.
