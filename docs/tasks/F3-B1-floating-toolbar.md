# F3-B1 FloatingToolbar dari kapabilitas
**Tujuan:** Toolbar mengambang yang isinya ditentukan registry, bukan percabangan tipe.
**Rujukan visual:** `docs/ui-ref/` (gambar V1 yang menampilkan toolbar di atas teks terpilih). Ambil posisi dan pengelompokan, bukan warna.
**Prasyarat:** F2-6, F3-B0.
**Boleh disentuh:** `apps/web/src/shell/floating-toolbar`, `apps/web/src/store` (aksi universal), `packages/core/src/registry` (definisi `text`; penambahan `group`/`quick`/`kind` bila belum ada), `apps/web/src/i18n`, tes.
**Dilarang:** `type ===` di UI; ikon atau warna di luar `Icon` dan token; menulis ke dokumen di luar aksi store.
**Isi:**
- Daftarkan tipe `text` di registry (kapabilitas sesuai `DATA_MODEL.md`; kolom cepat: font, ukuran, warna, tebal, rata).
- Aksi store baru: `toggleLock(ids)`, `duplicateElement(pageId, id)` (id baru, geser +5 mm, grup menyalin seluruh anak dengan id baru), `reorderElement(pageId, id, 'front'|'forward'|'backward'|'back')`. `deleteElement` sudah ada.
- Toolbar muncul di atas kotak seleksi dalam koordinat layar, otomatis dibalik ke bawah dan dijepit di dalam viewport kanvas, berukuran tetap pada zoom berapa pun. Tersembunyi tanpa seleksi. Tetap tampil di Mode Fokus.
- Kontrol khusus tipe berasal dari `propertySchema` yang bertanda `quick`, plus kontrol turunan kapabilitas: Cermin bila `flipH`, transparansi (langkah 25%) bila `opacity`, tombol engine berlabel `engine.label` bila `engine` ada.
- Kapsul universal: Kunci/Buka kunci, Duplikat, Hapus, "•••" (urutan layer). Elemen terkunci: kontrol yang mengubah geometri atau isi nonaktif.
**Kriteria penerimaan:**
- `toolbar.capability.test.tsx`: untuk **setiap tipe terdaftar** (iterasi registry), kontrol yang tampil sama persis dengan kontrol turunan kapabilitas dan kolom `quick`; kontrol transparansi hanya bila `opacity`, cermin hanya bila `flipH`, tombol engine hanya bila `engine` bukan null dengan label yang sama.
- Jumlah kontrol khusus tipe ≤ 6 untuk setiap tipe terdaftar (tes iterasi).
- Tes tambahan: mendaftarkan tipe palsu di registry uji menambah kontrolnya **tanpa mengubah kode toolbar**.
- `store.universal.test.ts`: `toggleLock`, `duplicateElement`, `reorderElement`, `deleteElement` masing-masing **satu entri Undo**; Undo mengembalikan dokumen `toEqual` semula; `duplicateElement` tidak menghasilkan id ganda di dokumen; `reorderElement` pada batas (sudah paling depan/belakang) tidak mengubah dokumen dan tidak menambah entri.
- Elemen terkunci: kontrol geometri `disabled`; tombol Kunci berlabel "Buka kunci".
- Playwright `toolbar.spec.ts`: toolbar berada di dalam viewport kanvas pada zoom 50%, 100%, 200%; lebar toolbar berbeda ≤ 1 px antar zoom; di Mode Fokus (panel dan Inspector tersembunyi) toolbar tetap ada dan aksi Duplikat berfungsi.
- Keyboard: semua kontrol dapat dijangkau dan dioperasikan; `Esc` menutup menu "•••"; semua kontrol punya `aria-label` dari kamus.
- axe: tidak ada pelanggaran tingkat serius atau kritis dengan menu terbuka.
- `pnpm check` hijau.
**Di luar cakupan:** grup (B5), tipe selain `text` dan puzzle yang sudah terdaftar.
**Bukti:** output tes, laporan axe, tiga tangkapan layar (zoom 50/100/200).
