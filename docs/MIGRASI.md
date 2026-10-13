# MIGRASI: dari v1 ke repo v2

v1 (prototipe di AI Studio dan GitHub) adalah **referensi baca-saja**. v2 dibangun di repo baru. Dokumen ini adalah langkah yang dikerjakan **manusia** (bukan agen) sebelum kartu F0-1 dimulai.

## Prinsip
- AI Studio hanya bisa push, tidak bisa clone. Karena itu sumber salinan adalah **GitHub**, bukan AI Studio.
- Repo v2 tidak boleh terhubung ke AI Studio. Konvensinya (`.aistudio/`, injeksi rahasia, `server.ts`) bertabrakan dengan monorepo v2.
- Hanya logika murni dan dokumen yang dibawa. Kode UI dan state v1 tidak dibawa.

## Langkah

### 1. Bekukan v1
1. Di AI Studio, dorong versi terakhir ke GitHub. Setelah itu **berhenti mengedit** di sana.
2. Clone dari GitHub (bukan dari AI Studio) dan beri tag:
   ```
   git clone https://github.com/markomh/Studio_Hybrid.git v1-ref
   cd v1-ref
   git tag v1-final
   git push origin v1-final
   ```
3. Periksa bahwa isi `v1-ref` sama dengan yang terakhir Anda lihat di AI Studio (jalankan aplikasinya, cek satu atau dua fitur terbaru).
4. Pastikan kunci Gemini hanya ada di Secrets AI Studio, bukan di repo (pemeriksaan riwayat git sebelumnya tidak menemukan kunci). Ganti kunci bila pernah dibagikan di tempat lain.
5. Jangan arsipkan repo GitHub dulu (lihat langkah 6).

### 2. Buat repo v2
1. Buat repo baru kosong di GitHub (mis. `studio-hybrid-v2`). Bukan fork dari v1.
2. Ekstrak isi paket dokumen ini ke root repo baru.
3. Commit pertama: `docs: paket dokumen v2`.

### 3. Bawa rujukan v1 ke repo v2
Jalankan dari dalam `v1-ref` (sudah di tag `v1-final`), tujuan adalah repo v2:
```
V2=../studio-hybrid-v2
mkdir -p $V2/docs/legacy $V2/docs/legacy-src

# dokumen lama (folder v1 bernama doc/, v2 memakai docs/)
cp doc/*.md $V2/docs/legacy/

# logika murni yang akan dipindahkan (lihat docs/PORTING.md)
cp src/utils/mazeGenerator.ts        $V2/docs/legacy-src/
cp src/utils/wordSearchGenerator.ts  $V2/docs/legacy-src/
cp src/utils/sudokuGenerator.ts      $V2/docs/legacy-src/
cp src/utils/kdpCalculator.ts        $V2/docs/legacy-src/
cp src/utils/paginationEngine.ts     $V2/docs/legacy-src/
cp src/fonts/fontResolver.ts         $V2/docs/legacy-src/
cp src/registry/ElementRegistry.ts   $V2/docs/legacy-src/
cp src/types/index.ts                $V2/docs/legacy-src/types.index.ts
```
Jika sebuah berkas tidak ditemukan di path itu, cari dengan `git ls-files | grep <nama>`. Jangan menyalin berkas lain.

### 4. Tambahkan README di `docs/legacy-src/`
Isi `docs/legacy-src/README.md`:
```
# legacy-src (BACA-SAJA)
Rujukan dari v1, tag `v1-final`. Tidak dikompilasi, tidak di-lint, tidak dites.
DILARANG diimpor dari `packages/` atau `apps/`.
Pindahkan logikanya dengan menulis ulang di `packages/core` beserta tesnya (lihat docs/PORTING.md).
Folder ini dihapus setelah fase 2 selesai.
```
Commit: `docs: rujukan v1 (baca-saja)`.

### 5. Mulai kartu
Berikan agen kartu `docs/tasks/F0-1-scaffold.md`. Kartu F0-1 dan F0-2 sudah memastikan `docs/legacy-src/` dikecualikan dari semua alat dan tidak boleh diimpor.

### 6. Setelah fase 2 selesai
1. Hapus `docs/legacy-src/` dari repo v2 (riwayatnya tetap ada di git dan di repo v1).
2. Putuskan sambungan AI Studio ke repo v1 bila masih ada, lalu arsipkan repo GitHub v1 (Settings, Archive). Arsip tetap bisa di-clone dan bisa dibatalkan.
3. Biarkan aplikasi v1 di AI Studio hidup selama v2 belum melewati fase 4; setelah itu boleh dimatikan.

## Daftar periksa
- [ ] Versi terakhir v1 sudah di GitHub dan bertag `v1-final`.
- [ ] Repo v2 baru, bukan fork, dan tidak terhubung ke AI Studio.
- [ ] `docs/legacy/` dan `docs/legacy-src/` berisi rujukan, dengan README baca-saja.
- [ ] Tidak ada kunci API atau berkas `.env` asli di repo v2.
- [ ] Kartu F0-1 siap diberikan ke agen.
