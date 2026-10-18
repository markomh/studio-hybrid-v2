# Fase 3, gelombang B — Kontrol berbasis kapabilitas (catatan bersama)

**Prasyarat umum (semua kartu B):**
- `pnpm check` hijau (termasuk `typecheck`) dan `pnpm --filter @studio-hybrid/web build` berhasil.
- Shell memakai token tema terang dan membaca data dokumen nyata (bukan label tetap). Perbaikan ini dikerjakan di kartu perbaikan F3-R sebelum gelombang B dimulai.
- F2-6 selesai (registry, `capabilities`, `propertySchema`). Gelombang B **tidak boleh menebak bentuk registry**: baca implementasinya dulu.
- F3-A5 selesai (`core/book/margins`) untuk B5.

## Urutan
B1 → B2 → B3 → B4 → B5 → B6 dan B7 (B6 dan B7 boleh paralel setelah B3). B5 besar: kerjakan sebagai dua PR (5A snapping, 5B grup) bila perlu.

## Keputusan bersama [ASUMSI; ubah di sini bila berbeda]
| ID | Keputusan |
| :--- | :--- |
| B-1 | Bentuk `PropertyField`: `{ key, labelKey, kind: 'text'\|'textarea'\|'number'\|'slider'\|'color'\|'select'\|'switch', group: 'basic'\|'advanced', unit?, min?, max?, step?, options?, quick?: number, validate? }`. Bila hasil F2-6 belum memuat `group`, `quick`, dan `kind`, tambahkan secara aditif di B1 |
| B-2 | **Floating bar:** kontrol khusus tipe maksimal 6 (urut menurut `quick`), ditambah kapsul universal terpisah (Kunci, Duplikat, Hapus, "•••"). Mekanismenya `quick`, bukan `ControlZone`/`ControlPriority` (K-4 tetap ditunda) |
| B-3 | **Seleksi** hidup di slice `ui` pada store, terpisah dari dokumen. Mengubah seleksi tidak pernah membuat entri Undo |
| B-4 | **Seret dan transformasi:** pratinjau memakai state sementara; **satu `transaction` saat pointer dilepas** = satu entri Undo. Dilarang menulis ke dokumen pada tiap gerakan |
| B-5 | Ambang snapping dan ukuran gagang dalam **piksel layar**, dikonversi ke mm lewat zoom. Geometri tetap mm (I-1) |
| B-6 | Pintasan: `Esc` batal/lepas seleksi, panah geser 1 mm (`Shift` 10 mm), `Alt+→/←` pilih elemen berikut/sebelumnya. `Tab` tetap Mode Fokus. Semua pintasan terdaftar di satu berkas dan diuji |
| B-7 | Semua teks UI lewat `t()`. Semua ikon lewat `Icon`. Semua warna dari token |
| B-8 | Setiap geometri murni (hit test, resize, rotasi, snap, grup) ada di `packages/core/src/geometry` dan **diuji di Node tanpa DOM** |

## Definisi selesai gelombang B
Pengguna dapat memilih, memindah, mengubah ukuran, memutar, mengelompokkan, dan menyunting objek dari toolbar dan Inspector yang digerakkan registry; menambah teks, puzzle, bentuk, dan gambar dari panel; semua aksi satu entri Undo; hasil identik di kanvas dan PDF (≤ 0,5 mm); dan tidak ada percabangan `type ===` di UI.
