# PRD — Studio Hybrid V2

**Status:** Draf untuk dikoreksi pemilik produk
**Posisi:** V1 (repo lama) adalah prototipe dan **referensi**. V2 dibangun di repo baru. Tujuan V2 adalah **menyelesaikan masalah V1 dan mengambil yang sudah baik**, bukan menambah fitur baru.
**Cara membaca:** Bagian bertanda **[ASUMSI]** adalah tebakan yang perlu Anda setujui atau ganti. Daftar keputusan ada di bagian 11.

---

## 1. Ringkasan

**Visi.** Ruang kerja bagi kreator untuk menyusun, menyunting, memeriksa, dan mengekspor buku puzzle dan aktivitas yang siap cetak, dari satu tempat.

**Tiga janji produk** (juga di `AGENTS.md`):
1. Yang terlihat di layar sama dengan yang tercetak.
2. Tidak ada kerja yang hilang.
3. Tidak ada klaim palsu: status "siap cetak" hanya muncul bila pemeriksaan nyata lulus.

Ketiga janji ini yang dilanggar V1 (lihat bagian 4). V2 ada untuk menepatinya.

**Nama.** PRD awal memakai "Maze Pro Studio Hybrid Workspace"; repo memakai "Studio Hybrid". Dokumen ini memakai **Studio Hybrid** sementara (D-1).

## 2. Prinsip penentuan ruang lingkup

1. **Ambil yang baik.** Konsep, algoritma, dan perilaku V1 yang terbukti baik dipindahkan, dengan tes baru. Kode tidak disalin begitu saja.
2. **Perbaiki yang cacat.** Setiap masalah V1 di bagian 4 punya perbaikan dan kartu.
3. **Tidak menambah yang belum ada di V1 sampai V2 matang.** Fitur baru masuk bagian 10 (setelah V2 matang), bukan MVP.
4. **Paritas lebih dulu.** Sebuah fitur V1 dianggap selesai di V2 bila perilakunya sama atau lebih baik, dan dibuktikan tes.

**V2 dianggap matang bila [ASUMSI]:**
- Semua ukuran keberhasilan di bagian 7 lulus.
- Minimal dua buku nyata dibuat penuh di V2 dan diunggah ke KDP.
- Tidak ada bug P0 atau P1 terbuka selama dua minggu pemakaian.
- Seluruh tes otomatis (unit, paritas, e2e, arsitektur) hijau di CI.

Tanpa batas matang yang tertulis, "nanti setelah matang" tidak pernah tiba.

## 3. Pengguna

| Persona | Peran di V2 |
| :--- | :--- |
| **Pembuat activity/puzzle book untuk KDP** | **Fokus utama [ASUMSI]** |
| Content creator edukasi (worksheet) | Dilayani lewat generator worksheet |
| Desainer grafis, ilustrator digital | Setelah V2 matang |

## 4. Masalah V1 yang harus teratasi

| ID | Masalah di V1 | Perbaikan di V2 | Kartu |
| :--- | :--- | :--- | :--- |
| P-1 | Tidak ada penyimpanan; label "Tersimpan" statis | Autosave IndexedDB dengan status nyata; cadangan `.shbook` | F1-3 |
| P-2 | PDF tidak sama dengan kanvas (artboard 430 px vs 375×520 px) | Satuan mm, satu hasil layout untuk SVG dan PDF | F1-1, F1-5, F1-6, F1-7 |
| P-3 | Font PDF berbeda dari font kanvas; tidak ter-embed | Font OFL dibundel dan ter-embed | F1-4, F1-6 |
| P-4 | Preflight berupa teks statis "Lolos" | Aturan preflight nyata | F2-11, fase 4 |
| P-5 | Dua sistem Undo | Satu mekanisme berbasis patch | F1-2 |
| P-6 | Model data ganda (field warisan + `elements[]`) | Satu skema berversi | F1-1 |
| P-7 | Word Search dan Sudoku tidak deterministik; Sudoku tanpa uji keunikan; seed 0 jadi acak | Generator ber-seed, solusi tunggal | F2-1 sampai F2-4 |
| P-8 | Opsi algoritma labirin yang tidak diimplementasikan | Enum hanya berisi yang ada dan dites | F2-2, F2-6 |
| P-9 | Kunci jawaban hanya untuk labirin dan berupa salinan | Solusi diturunkan dari puzzle sumber, semua tipe | F2-10 |
| P-10 | Kontrol satu tipe bocor ke tipe lain; percabangan `type ===` di UI | UI digerakkan kapabilitas; aturan lint | F2-12, fase 3 |
| P-11 | Worksheet bergantung endpoint AI | Generator matematika deterministik | F2-5 |
| P-12 | `App.tsx` 1.400+ baris, tanpa tes otomatis | Modul terpisah, `pnpm check` sebagai gerbang | F0-1 sampai F0-3 |
| P-13 | Endpoint AI tanpa autentikasi dan rate limit | Fitur AI ditunda; tidak ada server di V2 | — |

## 5. Inventaris V1 dan keputusan V2

Status V1 berdasarkan pembacaan kode. Modul bertanda **audit** belum saya periksa mendalam dan harus diaudit singkat sebelum fase yang memakainya.

| Fitur V1 | Keputusan | Fase |
| :--- | :--- | :-: |
| Seleksi tunggal dan grup, deep select, 8 handle resize, rotasi, snapping | **Ambil konsep**, bangun ulang di renderer SVG | 3 |
| Siklus objek: kunci, duplikat, hapus, urutan layer, group/ungroup | **Ambil** | 1–3 |
| Mode Fokus | **Ambil** | 3 |
| FloatingToolbar dan ContextInspector (pembagian zona) | **Ambil rancangan**, bangun ulang berbasis kapabilitas | 3 |
| ElementRegistry (satu sumber definisi tipe) | **Ambil konsep**, tulis ulang | 2 |
| Generator labirin, Word Search, Sudoku | **Ambil dan perbaiki** (seed, keunikan) | 2 |
| Worksheet | **Bangun ulang** deterministik | 2 |
| Penomoran halaman, peran halaman, margin recto/verso | **Ambil** | 2–4 |
| Kalkulator KDP (gutter, punggung buku) | **Ambil**; cek ulang aturan KDP terbaru | 4 |
| Ekspor PDF vektor | **Bangun ulang** (paritas, font) | 1–2 |
| Mode Grayscale dan panduan bleed | **Ambil** | 4 |
| Shape, unggah gambar, multi-seleksi (sebagian di V1) | **Ambil paritas** dan perbaiki | 3 |
| Cover wrap workspace | **Audit**, ambil bila baik | 4 |
| Batch Generator | **Audit**, ambil (sangat sesuai persona utama) | 4 |
| Download Center dan KDP Toolkit | **Ambil sebagai Ekspor**; hapus klaim palsu; harga diberi label "perkiraan" | 4 |
| Dashboard dan daftar proyek | **Audit**, sederhanakan menjadi daftar proyek | 4 |
| Tab Pages (thumbnail, urutan, duplikat) dan Bingkai | **Ambil** | 3 |
| Panel Asset Library | **Audit**; V2 hanya set clipart SVG bundel | 3–4 |
| AI Page Storyteller dan endpoint AI | **Tidak di V2** | — |
| Penyimpanan proyek | **Baru** (V1 tidak punya) | 1 |
| Preflight | **Baru dan nyata** (V1 hanya teks) | 2, 4 |

## 6. Ruang lingkup V2

**Termasuk:** seluruh baris bergaris tebal "Ambil" dan "Baru" pada bagian 5, dalam bentuk yang lulus kriteria penerimaan kartu.

**Tidak termasuk (setelah V2 matang, bagian 10):** akun, sinkron, kolaborasi, langganan, fitur AI, marketplace aset, integrasi pesanan cetak, Calendar, Tracker, Planner, editor foto, align/distribute/smart guide, panel Layer, template halaman, ekspor SVG/PNG per puzzle, preset Etsy dan POD.

## 7. Ukuran keberhasilan

Angka berikut usulan, belum hasil pengukuran **[ASUMSI]**.

| ID | Ukuran |
| :--- | :--- |
| G-1 | Pengguna baru membuat buku puzzle 24 halaman dan mengekspor PDF dalam ≤ 60 menit tanpa bantuan |
| G-2 | PDF hasil ekspor diterima unggahan KDP tanpa perbaikan manual (uji dengan akun penerbitan nyata) |
| G-3 | Posisi elemen di PDF berbeda ≤ 0,5 mm dari kanvas (tes otomatis) |
| G-4 | 0 insiden kehilangan data pada uji reload, tutup tab, dan pemulihan cadangan |
| G-5 | 0 klaim "lolos" yang tidak berasal dari aturan preflight |
| G-6 | Semua generator deterministik: seed sama menghasilkan hasil sama (tes otomatis) |

## 8. Perjalanan pengguna

| Langkah | Pengguna melakukan | Hasil |
| :--- | :--- | :--- |
| 1. Mulai | Membuat proyek, memilih ukuran dan jumlah halaman | Tersimpan otomatis |
| 2. Susun | Menambah halaman, memberi peran (judul, isi, solusi) | Penomoran dan margin sesuai peran |
| 3. Isi | Menambah puzzle, teks, bingkai, clipart; atau Batch Generator untuk banyak halaman | Puzzle tampil dengan seed tersimpan |
| 4. Rapikan | Mengubah lewat floating bar dan Inspector | Satu aksi, satu entri Undo |
| 5. Periksa | Membuka daftar preflight dan memperbaiki | Status siap cetak berasal dari aturan nyata |
| 6. Ekspor | Mengunduh PDF isi dan cover, menyimpan cadangan | PDF cocok dengan kanvas |

## 9. Kebutuhan fungsional dan pelacakannya

| ID | Kebutuhan | Fase | Kartu |
| :--- | :--- | :-: | :--- |
| FR-1 | Dokumen berskema, satuan mm, migrasi | 1 | F1-1 |
| FR-2 | Satu jalur mutasi dan Undo/Redo | 1 | F1-2 |
| FR-3 | Autosave nyata; cadangan `.shbook` | 1 | F1-3 |
| FR-4 | Teks dengan font tertanam, pemenggalan sama di kanvas dan PDF | 1 | F1-4 sampai F1-6 |
| FR-5 | Paritas kanvas–PDF teruji | 1 | F1-7 |
| FR-6 | Empat generator puzzle deterministik | 2 | F2-1 sampai F2-5 |
| FR-7 | Registry, kapabilitas, layout puzzle | 2 | F2-6, F2-7 |
| FR-8 | Render vektor puzzle di kanvas dan PDF | 2 | F2-8 |
| FR-9 | Acak ulang, jawaban, parameter | 2 | F2-9, F2-12 |
| FR-10 | Kunci jawaban turunan | 2 | F2-10 |
| FR-11 | Preflight puzzle | 2 | F2-11 |
| FR-12 | Cangkang editor berbasis kapabilitas; Mode Fokus | 3 | Belum ditulis |
| FR-13 | Seleksi tunggal/jamak, resize, rotasi, snapping, grup | 3 | Belum ditulis |
| FR-14 | Shape dan unggah gambar (paritas V1, diperbaiki) | 3 | Belum ditulis |
| FR-15 | Tab Halaman (thumbnail, urutan, duplikat) dan Bingkai | 3 | Belum ditulis |
| FR-16 | Preflight lengkap di antarmuka | 4 | Belum ditulis |
| FR-17 | Ekspor PDF isi, cover wrap, grayscale, bleed | 4 | Belum ditulis |
| FR-18 | Batch Generator | 4 | Belum ditulis |
| FR-19 | Kalkulator KDP (gutter, punggung, perkiraan biaya) | 4 | Belum ditulis |
| FR-20 | Daftar proyek, duplikat, hapus, impor/ekspor | 4 | Belum ditulis |
| FR-21 | Pipeline deploy situs statis | 4 | Belum ditulis |

## 10. Setelah V2 matang

| Tahap | Isi |
| :--- | :--- |
| V2.1 (prioritas pertama) | Template halaman, panel Layer, align/distribute/smart guide, ekspor SVG/PNG per puzzle |
| V2.2 | Calendar, Tracker, Planner; preset Etsy dan POD; brand kit |
| V3 | Akun dan sinkron, AI Assistant lewat server, perpustakaan aset, kolaborasi, langganan, integrasi pesanan cetak |

Template halaman saya taruh paling depan karena paling menolong non-desainer, tetapi V1 belum punya, jadi ia menunggu V2 matang. Perubahan skema untuk tahap berikutnya wajib lewat migrasi (ADR-0008).

## 11. Kebutuhan non-fungsional

- **Local-first:** data tidak meninggalkan perangkat; pengguna diingatkan membuat cadangan.
- **Keandalan:** gagal simpan terlihat jelas; tidak ada kehilangan data.
- **Performa [ASUMSI]:** generate puzzle ≤ 500 ms; buku 100 halaman tetap lancar.
- **Peramban [ASUMSI]:** versi terbaru Chrome, Edge, Firefox, Safari.
- **Aksesibilitas dasar:** aksi utama bisa dengan keyboard; kontras memadai.
- **Lisensi:** font dan aset hanya yang berlisensi terbuka, dengan berkas lisensi di repo.
- **Bahasa:** antarmuka Indonesia; konten puzzle sesuai D-6.

## 12. Keputusan terbuka

| ID | Pertanyaan | Asumsi sementara |
| :--- | :--- | :--- |
| D-1 | Nama produk resmi | "Studio Hybrid" |
| D-2 | Persona fokus V2 | Pembuat activity/puzzle book untuk KDP |
| D-3 | Model bisnis | Belum diputuskan; V2 tanpa akun dan tanpa batas |
| D-4 | Jumlah petunjuk Sudoku per tingkat | 36 / 30 / 24 |
| D-5 | Etsy/POD di V2 | Tidak; hanya KDP |
| D-6 | Bahasa konten puzzle | Indonesia dan Inggris |
| D-7 | `MIN_CELL_MM` dan `MIN_LETTER_PT` (terutama buku anak) | Ditentukan dari uji cetak sebelum fase 2 selesai |
| D-8 | Peramban yang didukung | Empat peramban terbaru |
| D-9 | Target G-1 dan G-2 | Perlu diuji dengan pengguna nyata |
| D-10 | Sumber dan lisensi set clipart SVG | Set terbuka yang lisensinya diperiksa |
| D-11 | Audit modul V1 yang belum diperiksa (Cover, Batch, Toolkit, Dashboard, Asset Library) | Dilakukan sebelum fase 3 dimulai |
| D-12 | Definisi "V2 matang" (bagian 2) | Empat kriteria di atas |

## 13. Pernyataan visi

Studio Hybrid V2 menyelesaikan apa yang dijanjikan V1: ruang kerja untuk menyusun, menyunting, memeriksa, dan mengekspor buku puzzle siap cetak, dengan hasil cetak yang sama dengan layar, pekerjaan yang tidak pernah hilang, dan status yang selalu bisa dibuktikan.
