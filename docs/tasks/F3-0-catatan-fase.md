# Fase 3 — Cangkang UI (tema terang)

**Prasyarat:** F1-7 lulus (paritas kanvas–PDF dan e2e simpan terbukti). UI tidak dibangun di atas fondasi yang belum diverifikasi.
**Dibagi dua gelombang.** Gelombang A tidak bergantung pada puzzle dan boleh dikerjakan sebelum atau sesudah fase 2. Gelombang B menunggu F2-6 (registry dan kapabilitas puzzle).

## Keputusan
| ID | Keputusan |
| :--- | :--- |
| D-13 | **Tema terang.** Tema gelap menunggu V2 matang. Tambahkan baris D-13 ke bagian "Keputusan terbuka" di `docs/PRD.md` (dikerjakan di F3-A1) |
| D-14 | Tombol "Bagikan" dari V1 **diganti "Ekspor"**. V2 tidak punya akun, jadi "Bagikan" menyesatkan |
| D-15 | Desktop-first: lebar minimal 1024 px. Di bawahnya tampilkan pesan "Gunakan layar yang lebih lebar", bukan tata letak rusak [ASUMSI] |
| D-16 | Font antarmuka memakai font sistem (ringan). Font dokumen tetap font bundel di `core/fonts` [ASUMSI] |

## Rujukan visual
Simpan tangkapan layar V1 di `docs/ui-ref/` (mis. `v1-editor-teks.png`, `v1-panel-elemen.png`). V1 bertema gelap: **ambil posisi zona dan perilaku, bukan warna**. Setiap kartu UI menyebut gambar yang relevan.

## Temuan dari tangkapan layar hasil F1-5 (kondisi awal)
- Gaya CSS belum aktif: elemen tersusun vertikal, tanpa tata letak.
- Ikon tidak berukuran sehingga membesar (ikon silang memenuhi layar).
- Teks tampak menyatu ("STUDIO HYBRIDActivity Book Workspace", "Keluar Mode FokusTab").
- Label menunjukkan "Keluar Mode Fokus" padahal tampilan tidak sedang fokus. Label atau status awal salah.
- Teks bawaan tampak sangat besar dibanding halaman. Periksa ukuran default di `createDefault` teks.
- Label "Tersimpan" harus dibuktikan benar oleh tes e2e F1-7, bukan diasumsikan.

## Gelombang A (kartu tertulis)
| Kartu | Isi |
| :--- | :--- |
| F3-A1 | Token desain tema terang, komponen dasar, ADR-0010 |
| F3-A2 | Tata letak shell lima zona dan Mode Fokus |
| F3-A3 | Header: nama proyek, status simpan jujur, Undo/Redo, File, Ekspor |
| F3-A4 | Footer: navigasi halaman, zoom, toggle, status kesiapan |
| F3-A5 | Viewport kanvas: zoom, pan, garis bantu (trim, bleed, margin) |
| F3-A6 | Panel kiri: tab Halaman dan tab Elemen (teks) |

Urutan: F3-A1 → F3-A2 → F3-A3 sampai F3-A6 (boleh paralel).

## Gelombang B (ditulis setelah gelombang A dan F2-6)
FloatingToolbar dari kapabilitas (maks. 6 kontrol) · Inspector dari `propertySchema` (Dasar/Lanjutan) · seleksi tunggal dan bounding box · resize dan rotasi · snapping dan grup · panel Elemen digerakkan registry dan tab Bingkai · Shape dan unggah gambar.

## Selesai gelombang A bila
Shell tampil rapi pada 1280×720 dan 1440×900 tanpa luapan horizontal, memakai tema terang yang lolos uji kontras, Mode Fokus bekerja benar, status simpan jujur, halaman dapat dinavigasi, di-zoom, dan diatur urutannya, dan semuanya dibuktikan tes (Vitest, Playwright, axe).
