# Kartu Tugas

Satu kartu = satu PR kecil. Kerjakan berurutan dalam satu fase. Jangan mulai kartu berikutnya sebelum yang sekarang lulus `pnpm check` dan semua kriteria penerimaannya.

Format kartu: Tujuan · Boleh disentuh · Dilarang · Kriteria penerimaan (berupa tes) · Di luar cakupan · Bukti.

## Fase 0 — Fondasi
| Kartu | Isi |
| :--- | :--- |
| F0-1 | Scaffold monorepo dan perintah `pnpm check` |
| F0-2 | Penegak arsitektur (ESLint, dependency-cruiser) |
| F0-3 | CI dan templat PR |

## Fase 1 — Walking skeleton (satu elemen teks dari kanvas sampai PDF)
| Kartu | Isi |
| :--- | :--- |
| F1-1 | Skema dokumen, satuan, migrasi |
| F1-2 | Store dan riwayat (Undo/Redo) |
| F1-3 | Penyimpanan Dexie dan status simpan jujur |
| F1-4 | Font dibundel, pengukuran dan pemenggalan teks |
| F1-5 | Layout, renderer SVG, dan cangkang kanvas minimal |
| F1-6 | Renderer PDF teks dengan font ter-embed |
| F1-7 | Tes paritas dan e2e |

## Selesai fase 1 bila
Pengguna dapat membuat dokumen, menambah dan memindah satu teks, me-reload tanpa kehilangan data, Undo/Redo, dan mengekspor PDF yang posisi dan fontnya sama dengan kanvas (selisih ≤ 0,5 mm), dan semua itu dibuktikan tes otomatis.

## Fase 2 — Generator puzzle (baca `F2-0-catatan-fase.md` dulu)
| Kartu | Isi |
| :--- | :--- |
| F2-1 | PRNG bersama dan larangan acak liar |
| F2-2 | Generator labirin (tiga algoritma, solusi BFS) |
| F2-3 | Generator Word Search |
| F2-4 | Generator Sudoku (solusi tunggal) |
| F2-5 | Generator Worksheet matematika |
| F2-6 | Registry, skema, dan kapabilitas puzzle |
| F2-7 | Layout puzzle menjadi primitif |
| F2-8 | Renderer SVG dan PDF untuk primitif gambar |
| F2-9 | Aksi store untuk puzzle |
| F2-10 | Kunci jawaban yang diturunkan (butuh ADR-0009) |
| F2-11 | Aturan preflight untuk puzzle |
| F2-12 | Kontrol UI dan uji ujung ke ujung |

Urutan: F2-1 → F2-2..5 (boleh paralel setelah F2-1) → F2-6 → F2-7 → F2-8 → F2-9 → F2-10 → F2-11 → F2-12.

### Selesai fase 2 bila
Empat jenis puzzle dapat ditambah, diacak (seed tersimpan, satu entri Undo), diubah parameternya, ditampilkan dengan jawaban, dan diekspor sebagai PDF vektor yang paritasnya dengan kanvas lulus tes; bagian kunci jawaban diturunkan dari puzzle sumber; preflight melaporkan masalah puzzle dari hasil aturan nyata.
