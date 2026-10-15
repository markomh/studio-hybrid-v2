# F3-A4 Footer
**Tujuan:** Navigasi dan tampilan, bukan pengaturan.
**Boleh disentuh:** `apps/web/src/shell/footer`, `apps/web/src/store` (status tampilan: zoom, toggle), tes.
**Dilarang:** konten yang pecah atau menyatu; skrol horizontal.
**Isi:**
- Kiri: tombol halaman sebelumnya/berikutnya dan "51 / 51" dalam **satu baris**; chip peran halaman dan sisi (Recto/Verso) dari `core/book`.
- Tengah: zoom (slider dan persen, 25–400%), tombol "Pas layar".
- Kanan: toggle berikon dengan tooltip: Garis bantu dan Monokrom (Monokrom hanya mengubah tampilan, tidak mengubah dokumen); status kesiapan cetak: "Belum diperiksa" selama `core.preflight` belum dipanggil atau mengembalikan hasil kosong yang belum divalidasi. Dilarang menampilkan "Siap cetak" sebelum fase 4.
**Kriteria penerimaan:**
- Playwright pada 1024, 1280, dan 1440 px: `footer.scrollWidth <= footer.clientWidth`; "51 / 51" tidak terpecah baris.
- Zoom hanya mengubah skala tampilan: `x` elemen dalam dokumen tetap sama (mm) setelah zoom 50% dan 200%.
- "Pas layar" membuat seluruh halaman terlihat tanpa gulir di kanvas.
- Toggle Garis bantu menampilkan atau menyembunyikan garis (F3-A5); Monokrom tidak menambah entri Undo dan tidak mengubah dokumen (bandingkan `toEqual`).
- Tidak ada teks "Siap cetak" atau "Lolos" di footer (tes teks).
- `pnpm check` hijau.
**Di luar cakupan:** preflight nyata, klik status untuk membuka daftar masalah (fase 4).
**Bukti:** output tes dan tangkapan layar tiga lebar.
