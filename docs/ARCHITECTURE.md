# ARCHITECTURE

## Prinsip
Data mengalir satu arah: **Aksi → Store (patch) → Dokumen → Layout → Renderer (SVG / PDF)**. Tidak ada jalur lain.

```
UI event ──► store action ──► Immer patches ──► Document (state)
                                   │                   │
                                   ▼                   ▼
                              History (undo)     core.layout(doc)
                                                       │
                                  ┌────────────────────┴───────────────┐
                                  ▼                                    ▼
                          SVG renderer (web)                  PDF renderer (core)
Document ──► Dexie (IndexedDB) autosave (debounce)
Document ──► core.preflight(doc, target) ──► Issue[] ──► UI
```

## Paket

### `packages/core` (TypeScript murni; boleh jalan di Node dan browser)
| Modul | Tugas |
| :--- | :--- |
| `schema/` | Skema Zod dokumen, versi, migrasi |
| `units/` | Konversi mm/pt/in; satu-satunya tempat konversi |
| `registry/` | Definisi tipe elemen: kapabilitas, skema properti, `layout`, `renderPdf` |
| `layout/` | Mengubah dokumen menjadi daftar primitif gambar (garis teks, rect, path, image) dalam mm |
| `text/` | Pengukuran dan pemenggalan teks (fontkit); dipakai bersama SVG dan PDF |
| `puzzles/` | Generator murni berbasis seed: maze, wordsearch, sudoku, worksheet |
| `book/` | Penomoran halaman, gutter KDP, lebar punggung, peran halaman |
| `preflight/` | Aturan pemeriksaan kesiapan cetak |
| `pdf/` | Renderer PDF (pdf-lib + fontkit), embed font |
| `fonts/` | Font OFL yang dibundel + berkas lisensi |

### `apps/web` (React)
| Modul | Tugas |
| :--- | :--- |
| `store/` | Zustand + Immer; aksi, transaksi, riwayat |
| `persistence/` | Dexie; autosave; status simpan; ekspor/impor cadangan |
| `canvas/` | Renderer SVG dari hasil `layout`; seleksi; transformasi |
| `shell/` | Header, panel kiri, Inspector, floating bar, footer (digerakkan registry) |
| `i18n/` | Kamus teks Indonesia |

## Primitif hasil layout
`layout` menghasilkan daftar primitif bertipe (`TextLine`, `Rect`, `Ellipse`, `Line`, `Path`, `Image`) dengan koordinat **mm absolut terhadap pojok kiri-atas trim halaman**. Kedua renderer hanya menerjemahkan primitif ini. Tidak ada logika tata letak di renderer.

## Undo/Redo
Store memakai `produceWithPatches`. Setiap aksi menghasilkan `{patches, inversePatches, label}`. `transaction(label, fn)` menggabungkan beberapa perubahan menjadi satu entri. Batas riwayat 100. Riwayat tidak menyimpan data biner (gambar direferensikan lewat `assetId`).

## Penyimpanan (local-first)
- Dexie: tabel `projects` (id, name, updatedAt, document) dan `assets` (id, blob, mime, bytes, sha256).
- Autosave: debounce 800 ms setelah perubahan; status `saving | saved | error`.
- Saat startup: panggil `navigator.storage.persist()`; tampilkan peringatan bila ditolak.
- Cadangan: ekspor/impor satu berkas `.shbook` (zip: `document.json` + `assets/`).
- Pengguna tidak boleh melihat "Tersimpan" kecuali transaksi tulis terakhir sukses.

## Registry dan UI
Tipe elemen mendaftar di registry dengan: `type`, `capabilities`, `propertySchema`, `layout`, dan `renderPdf` (bila perlu). Komponen UI **hanya** memakai `capabilities` dan `propertySchema`. Menambah tipe baru tidak boleh mengubah komponen shell.

## Zonasi UI
| Zona | Tugas |
| :--- | :--- |
| Panel kiri | Menambah (Template, Elemen, Halaman, Layer) |
| Floating bar | Mengubah objek terpilih dengan cepat (maks. 6 kontrol) |
| Inspector | Detail dan halaman: bagian Dasar terbuka, Lanjutan tertutup |
| Footer | Navigasi halaman, zoom, toggle tampilan, status kesiapan cetak |
| Header | Nama buku, status simpan, Undo/Redo, Mode Fokus, Ekspor/Terbitkan |
Aksi universal (kunci, duplikat, hapus, urutan layer) selalu ada di floating bar.

## Preflight
Fungsi murni `preflight(doc, target): Issue[]` dengan `Issue = {code, severity, pageId?, elementId?, message, fix?}`. Aturan awal: placeholder tersisa, elemen di luar safe zone, teks meluap, halaman kosong tanpa peran, grid puzzle terlalu rapat, kata lebih panjang dari grid, puzzle tanpa kunci jawaban bila buku memuat bagian solusi, gambar di bawah 300 dpi (ditambah saat gambar masuk). Antarmuka hanya menampilkan hasilnya; tidak ada teks "lolos" yang tidak berasal dari fungsi ini.

## Tes sebagai penegak
| Lapisan | Alat | Contoh |
| :--- | :--- | :--- |
| Unit | Vitest | skema, units, generator (seed), preflight, store |
| Golden | Vitest + pdfjs-dist | posisi teks di PDF vs primitif layout ≤ 0,5 mm; `emb = yes` untuk semua font |
| E2E | Playwright | tambah teks → reload → data masih ada → Undo → ekspor PDF |
| Arsitektur | dependency-cruiser + ESLint | `core` tanpa React; UI tanpa `type ===` |
