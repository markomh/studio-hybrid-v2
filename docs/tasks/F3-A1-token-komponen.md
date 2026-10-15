# F3-A1 Token desain tema terang dan komponen dasar
**Tujuan:** Satu bahasa visual yang konsisten, sebelum ada layar apa pun.
**Boleh disentuh:** `apps/web/src/ui` (token, komponen), konfigurasi Tailwind/PostCSS, `apps/web/src/i18n`, `docs/adr/0010-komponen-ui.md`, `docs/PRD.md` (hanya menambah baris D-13).
**Dilarang:** gaya inline di komponen fitur; warna di luar token; menambah dependensi tanpa ADR yang disetujui.
**Langkah pertama:** tulis ADR-0010 (pilihan Tailwind CSS, Radix UI untuk perilaku aksesibel, lucide-react untuk ikon; alasan dan alternatif) dan minta persetujuan sebelum memasang dependensi.
**Isi:**
- Token sebagai variabel CSS: `--surface`, `--surface-muted`, `--border`, `--text`, `--text-muted`, `--primary`, `--primary-contrast`, `--danger`, `--warning`, `--success`, `--focus-ring`, jarak, radius, bayangan. Nilai awal: teks `#111827`, teks pudar `#4B5563`, latar `#FFFFFF`/`#F7F8FA`, garis `#D1D5DB`, utama `#4F46E5`, bahaya `#B91C1C`. Tes kontras yang menentukan; ubah nilai bila gagal.
- Komponen: `Button`, `IconButton`, `Icon` (wajib prop `size`, bawaan 16 px), `Select`, `Tooltip`, `Menu`, `Tabs`, `Accordion`, `Slider`, `Switch`, `Dialog`, `Badge`, `Kbd`.
- Rute pengembangan `/ui-kit` yang menampilkan semua komponen (hanya mode dev).
- Kamus `i18n` dengan fungsi `t('kunci')`; teks antarmuka dilarang ditulis langsung di komponen.
**Kriteria penerimaan:**
- `tokens.test.ts`: setiap pasangan teks/latar yang dipakai komponen memiliki rasio kontras ≥ 4,5:1 (≥ 3:1 untuk teks besar dan ikon) dihitung dari nilai token.
- `icon.test.tsx`: `Icon` tanpa `size` memakai 16 px; tidak ada `<svg>` mentah tanpa ukuran di `apps/web/src` (tes grep atau aturan lint).
- `i18n.test.ts`: tidak ada string literal berbahasa Indonesia di berkas `.tsx` komponen (aturan lint atau tes pemindai) kecuali di `i18n/`.
- Playwright `ui-kit.spec.ts`: halaman `/ui-kit` tidak punya pelanggaran axe tingkat serius atau kritis; setiap komponen dapat dioperasikan dengan keyboard (Tab, Enter, Esc, panah).
- Tangkapan layar baseline `/ui-kit` pada 1280×720 disimpan untuk perbandingan visual berikutnya.
- `pnpm check` hijau.
**Di luar cakupan:** layar aplikasi, tema gelap.
**Bukti:** output tes, laporan axe, tangkapan layar `/ui-kit`.
