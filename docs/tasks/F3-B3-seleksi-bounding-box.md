# F3-B3 Seleksi dan kotak pembatas
**Tujuan:** Memilih dan memindah objek dengan benar, dalam mm, dengan satu entri Undo per gerakan.
**Rujukan visual:** `docs/ui-ref/` (kotak seleksi dengan label ukuran).
**Prasyarat:** B1, F3-A5.
**Boleh disentuh:** `packages/core/src/geometry` (hit test, marquee), `apps/web/src/canvas` (overlay seleksi), `apps/web/src/store` (slice `ui`), tes.
**Dilarang:** menyimpan seleksi di dokumen; menulis ke dokumen pada setiap gerakan pointer (B-4).
**Isi:**
- Slice `ui.selection: string[]` di store (dipindah dari `useState` di `App.tsx`). Seleksi dibersihkan saat halaman aktif berganti; id elemen yang dihapus keluar dari seleksi.
- `hitTest(page, pointMm)` mengembalikan elemen teratas menurut urutan z, melewati `hidden`, benar untuk elemen berotasi. `marqueeSelect(page, rectMm)` memilih elemen yang beririsan, melewati `hidden`, menyertakan yang terkunci.
- Klik memilih; klik area kosong atau `Esc` melepas; `Shift`+klik menambah/mengurangi; seret area kosong = marquee. `Alt+→/←` memilih berikut/sebelumnya.
- Overlay SVG: garis seleksi warna `--primary`, tebal tetap dalam piksel pada zoom berapa pun, label "W × H mm" di dekat kotak. Kotak gabungan untuk banyak objek. Wilayah status `role="status"` mengumumkan "N objek dipilih".
- Seret objek terpilih: pratinjau lewat state sementara; **satu `transaction` saat dilepas**. Panah menggeser 1 mm (`Shift` 10 mm), satu entri per tekan. Elemen terkunci tidak bergerak.
**Kriteria penerimaan:**
- `selection.store.test.ts`: pilih, toggle, kosongkan; seleksi bersih saat halaman berganti dan saat elemen dihapus; **perubahan seleksi tidak menambah entri riwayat**.
- `hit.test.ts` (tanpa DOM): mengenai elemen teratas; melewati `hidden`; elemen persegi berotasi 45°: titik di dalam kotak sejajar sumbu tetapi di luar bentuk berotasi **tidak** mengenai, titik di dalam bentuk berotasi mengenai.
- `marquee.test.ts`: irisan benar, `hidden` dilewati, terkunci ikut terpilih.
- `overlay.test.tsx`: koordinat kotak seleksi = nilai mm × skala (toleransi 0,5 px) pada zoom 50%, 100%, 200%; tebal garis dalam piksel sama pada ketiga zoom.
- `drag.test.tsx`: seret 10 mm pada zoom 50% dan 200% mengubah `x` tepat 10 mm (±0,01); **satu entri Undo**; Undo mengembalikan `x` semula; selama seret tidak ada tulis ke dokumen (pantau jumlah pemanggilan aksi store).
- Elemen terkunci: seret dan panah tidak mengubah dokumen dan tidak menambah entri.
- Panah: 1 mm dan `Shift`+panah 10 mm, masing-masing satu entri.
- Playwright `selection.spec.ts`: klik, `Shift`+klik, marquee, klik kosong, `Esc`; tangkapan layar baseline.
- `pnpm check` hijau.
**Di luar cakupan:** gagang ubah ukuran dan rotasi (B4), snapping (B5).
**Bukti:** output tes dan tangkapan layar.
