# F3-A2 Tata letak shell lima zona dan Mode Fokus
**Tujuan:** Kerangka layar yang rapi dan stabil; isi tiap zona boleh placeholder.
**Rujukan visual:** `docs/ui-ref/v1-editor-teks.png` (posisi zona saja; tema terang).
**Boleh disentuh:** `apps/web/src/shell`, `apps/web/src/App.tsx` (hanya memasang shell), tes.
**Dilarang:** `type ===` di UI; menghitung geometri dokumen di komponen; warna di luar token.
**Isi:**
- CSS Grid: header (atas), rail ikon kiri + panel (drawer) kiri, area kanvas (tengah, dapat digulir), Inspector (kanan), footer (bawah). Area kanvas mengisi sisa ruang; halaman tidak memicu gulir pada body.
- Mode Fokus: pintasan `Tab` dan tombol di header. Saat aktif, panel kiri dan Inspector disembunyikan; **FloatingToolbar tetap ada**. Status awal **tidak fokus**. Label tombol: "Mode Fokus" saat tidak aktif, "Keluar Mode Fokus" saat aktif.
- Inspector dapat diciutkan di lebar 1024–1279 px. Di bawah 1024 px tampilkan pesan "Gunakan layar yang lebih lebar" (D-15).
**Kriteria penerimaan:**
- Playwright `shell.spec.ts` pada 1280×720 dan 1440×900: kelima zona terlihat dan tidak saling menimpa (bounding box tidak beririsan); `document.body.scrollWidth <= innerWidth` dan `scrollHeight <= innerHeight`.
- Awal pemuatan: tombol berlabel "Mode Fokus"; tekan `Tab` → panel kiri dan Inspector tersembunyi, toolbar tetap, label berubah; tekan lagi → kembali.
- Pada 1100 px Inspector dapat diciutkan dan dibuka kembali; pada 900 px pesan lebar layar muncul.
- Fokus keyboard bergerak berurutan antar zona (header → rail → panel → kanvas → Inspector → footer) dan setiap zona punya `role`/`aria-label`.
- Tidak ada teks yang menyatu atau ikon tanpa ukuran (uji: tidak ada elemen `svg` lebih lebar dari 32 px di shell).
- Tangkapan layar baseline shell pada kedua ukuran.
- `pnpm check` hijau.
**Di luar cakupan:** isi panel, Inspector, dan toolbar.
**Bukti:** output tes dan tangkapan layar.
