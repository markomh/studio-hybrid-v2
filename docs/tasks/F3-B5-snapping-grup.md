# F3-B5 Snapping dan grup
**Tujuan:** Penempatan presisi dengan panduan, dan pengelompokan objek yang bisa dibatalkan tanpa cacat.
**Prasyarat:** B3, B4, F3-A5. Kerjakan sebagai dua PR bila perlu: **5A snapping**, **5B grup**.
**Boleh disentuh:** `packages/core/src/geometry` (snap, grup), `packages/core/src/layout` (perataan grup), `apps/web/src/canvas`, `apps/web/src/store`, `apps/web/src/shell/floating-toolbar`, tes.
**Dilarang:** grup di dalam grup; menulis ke dokumen selama pratinjau seret.

## 5A Snapping
- `snap(movingBox, targets, thresholdMm)` → `{ dx, dy, guides }` (fungsi murni). Target: tepi trim halaman, garis margin dari `core/book/margins`, garis tengah halaman, serta tepi dan pusat elemen lain di halaman. Ambang 5 px layar dikonversi ke mm (B-5).
- Garis panduan digambar selama seret (warna token) dan hilang saat dilepas. Menahan `Alt` menonaktifkan snapping sementara.
**Kriteria 5A:**
- `snap.test.ts`: kotak dekat margin kiri dalam ambang menempel tepat ke margin; di luar ambang tidak berubah; menempel ke garis tengah; menempel ke tepi dan pusat elemen lain; bila beberapa kandidat, memilih yang terdekat; `guides` memuat posisi garis yang dipakai.
- Ambang dalam piksel: pada zoom 200% jarak mm yang memicu snap setengah dari zoom 100% (tes).
- `Alt` menonaktifkan snap (tes komponen). Snap tidak mengubah jumlah entri Undo (tetap satu per seret).
- Playwright: seret mendekati margin, garis muncul dan posisi akhir tepat pada margin (±0,01 mm).

## 5B Grup
- Aksi store `groupElements(pageId, ids)` dan `ungroupElement(pageId, id)`, masing-masing satu entri Undo. Kelompok memakai `GroupElement` pada `DATA_MODEL.md`: koordinat anak relatif terhadap grup; kotak grup = kotak pembatas anak; grup menempati posisi z elemen teratas yang digabung.
- Grup mendukung pindah, putar, kunci, duplikat, hapus, urutan layer. **Ubah ukuran grup tidak didukung** (hanya gagang rotasi). Ungroup menyerap rotasi grup ke anak: pusat anak diputar mengelilingi pusat grup dan `rotation` anak ditambah rotasi grup.
- Tombol "Grup" tampil hanya bila seleksi **lebih dari satu**; "Pisahkan" hanya bila seleksi satu grup. Dinonaktifkan dengan alasan bila seleksi memuat grup atau elemen terkunci.
- Seleksi dalam (deep select): klik ganda anak memilih anak; `Esc` kembali memilih grup. Memindah anak memperbarui koordinat relatifnya dan menghitung ulang kotak grup.
- `layout` meratakan grup menjadi primitif dengan transformasi tersusun.
**Kriteria 5B:**
- `group.test.ts`: grup lalu ungroup (rotasi grup 0°) mengembalikan elemen `toEqual` semula (id, x, y, w, h, rotation).
- Grup berotasi 30° dan 90° lalu ungroup: pusat anak di dunia sama dengan hasil putar (≤ 1e-6 mm) dan `rotation` anak = rotasi anak + rotasi grup.
- Primitif `layout` untuk grup identik (≤ 1e-6 mm) dengan primitif elemen hasil ungroup.
- Grup mendapat id baru; anak mempertahankan id. Z-order: grup di indeks teratas anak; ungroup mengembalikan anak berurutan di indeks grup dengan urutan relatif semula.
- Grup ditolak (aksi mengembalikan galat bertipe, dokumen tidak berubah, tanpa entri) bila seleksi < 2, memuat grup, atau memuat elemen terkunci.
- Satu entri Undo untuk grup dan untuk ungroup; Undo mengembalikan dokumen `toEqual` semula.
- Deep select: klik ganda memilih anak; `Esc` memilih grup; memindahkan anak 5 mm memperbarui koordinat relatif anak dan kotak grup (tes nilai).
- Tombol "Grup" tidak muncul pada seleksi tunggal (tes teks) dan "Pisahkan" muncul pada seleksi satu grup.
- Paritas: teks dalam grup berotasi di PDF berbeda ≤ 0,5 mm dari `layout`.
- Playwright `group.spec.ts`: grup lewat tombol, deep select, ungroup, Undo; tangkapan layar baseline.
- `pnpm check` hijau.
**Di luar cakupan:** snapping ke grid, ubah ukuran grup, perataan dan distribusi (setelah V2 matang).
**Bukti:** output tes dan tangkapan layar.
