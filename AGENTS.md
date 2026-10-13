# AGENTS.md — Baca ini pertama

## Misi (satu paragraf)
Studio Hybrid adalah workspace untuk membuat **buku puzzle dan aktivitas siap cetak** (Amazon KDP, Etsy, POD). Pengguna utama adalah non-desainer. Produk ini bukan sekadar generator: pengguna menyusun halaman, mengedit objek, mengecek kesiapan cetak, lalu mengekspor PDF yang **sama persis** dengan yang terlihat di layar. Data tersimpan di browser pengguna (local-first). Tidak ada server untuk data buku pada rilis pertama.

Konteks produk dan ruang lingkup MVP ada di `docs/PRD.md` (bacaan opsional; kartu tugas sudah cukup untuk bekerja).

## Tiga janji produk (tidak boleh dilanggar)
1. **Yang terlihat = yang tercetak.** Kanvas dan PDF memakai satu hasil tata letak yang sama.
2. **Tidak ada kerja yang hilang.** Autosave nyata; indikator "Tersimpan" hanya tampil bila data benar-benar sudah ditulis.
3. **Tidak ada klaim palsu.** Status "siap cetak" hanya muncul bila pemeriksaan nyata lulus.

## Glosarium
| Istilah | Arti |
| :--- | :--- |
| Dokumen | Satu buku: metadata + daftar halaman |
| Halaman | Satu lembar dengan peran (cover, front_matter, body, solutions, appendix) |
| Elemen | Objek di halaman: text, image, shape, puzzle, group |
| Kapabilitas | Daftar kemampuan sebuah tipe elemen (bisa diputar? ada opacity? ada engine?) |
| Registry | Satu-satunya tempat tipe elemen didefinisikan |
| Preflight | Pemeriksaan kesiapan cetak; fungsi murni di `core` |
| Trim / Bleed / Gutter | Ukuran potong / area luber / margin dalam (lihat DATA_MODEL.md) |
| mm | Satu-satunya satuan untuk geometri dokumen |

## Struktur repo
```
packages/core   TypeScript murni. Skema, tata letak, generator, preflight, renderer PDF. TANPA React/DOM.
apps/web        React + Vite. UI, store, penyimpanan, renderer SVG.
docs/           ARCHITECTURE, DATA_MODEL, adr/, tasks/
```

## Aturan rujukan v1
`docs/legacy/` dan `docs/legacy-src/` adalah rujukan **baca-saja** dari prototipe v1. Dilarang mengubah, mengimpor, atau mengompilasinya. Memindahkan logika berarti menulis ulang di `packages/core` dengan tes (lihat `docs/PORTING.md`).

## Perintah
- `pnpm install`
- `pnpm check` = lint + typecheck + test + pemeriksa dependensi. **Harus hijau sebelum Anda menyatakan tugas selesai.**
- `pnpm dev` = jalankan web; `pnpm test` = Vitest; `pnpm e2e` = Playwright.

## Invarian (ditegakkan mesin; jangan dilewati)
- I-1 Geometri selalu dalam **mm**. Piksel hanya ada di lapisan tampilan.
- I-2 `core` tidak boleh mengimpor `react`, `react-dom`, atau API DOM.
- I-3 UI tidak boleh memeriksa nama tipe (`type === 'text'`). UI membaca `capabilities` dari registry.
- I-4 Semua perubahan dokumen lewat **aksi store** yang menghasilkan patch. Dilarang memutasi dokumen langsung.
- I-5 Satu aksi pengguna = satu entri Undo.
- I-6 Kanvas (SVG) dan PDF memakai hasil `layout` yang sama dari `core`. Dilarang menghitung tata letak sendiri di renderer.
- I-7 Setiap data yang dimuat atau disimpan divalidasi skema Zod. Perubahan bentuk data wajib punya migrasi dan tes.
- I-8 Satu properti punya satu sumber kebenaran. Dilarang menyimpan salinan di state lokal komponen.
- I-9 Teks UI berbahasa Indonesia, lewat kamus `i18n`. Identifier dan komentar kode berbahasa Inggris.

## Cara bekerja
1. Ambil **satu kartu tugas** dari `docs/tasks/`. Kerjakan hanya itu.
2. Baca file yang akan disentuh sebelum mengubahnya.
3. Tulis **tes penerimaan lebih dulu** (atau pastikan sudah ada), lalu implementasi.
4. Perubahan sekecil mungkin. Jangan merapikan, mengganti nama, atau memformat ulang di luar kartu.
5. Jangan menambah dependensi tanpa menulis ADR singkat dan meminta persetujuan.
6. Jalankan `pnpm check`. Lampirkan outputnya di laporan.

## Berhenti dan tanya jika
- Kartu bertabrakan dengan invarian atau dokumen lain.
- Perlu menyentuh file di luar daftar "boleh disentuh".
- Tes gagal dan penyebabnya bukan perubahan Anda.
- Ada keputusan produk yang tidak tertulis. Jangan berasumsi.

## Format laporan per tugas
1. Ringkasan (maks. 10 baris).
2. Daftar file berubah.
3. Output `pnpm check`.
4. Checklist kriteria penerimaan: lulus / gagal / belum teruji, dengan bukti.
5. Risiko dan hal yang perlu dicek manual.

## Jebakan dari versi 1 (jangan diulang)
- Dua sistem Undo berdampingan → bug urutan mundur.
- Artboard kanvas 430 px vs asumsi PDF 375×520 px → posisi PDF bergeser.
- Model data ganda (field warisan di halaman + `elements[]`) → status solusi tidak sinkron.
- Label "Tersimpan" statis padahal tidak ada penyimpanan.
- Preflight berupa teks "Lolos" tanpa pemeriksaan.
- Font kanvas (CSS sistem) berbeda dari font PDF.
- Dropdown yang menawarkan opsi yang tidak diimplementasikan (algoritma labirin).
- Kontrol milik satu tipe muncul di tipe lain karena pengelompokan `isVisual`.

## Definisi selesai (semua tugas)
- `pnpm check` hijau.
- Setiap kriteria penerimaan punya tes atau bukti yang disebutkan.
- Tidak ada pelanggaran invarian.
- Tidak ada TODO tanpa nomor kartu.
