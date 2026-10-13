# F0-2 Penegak arsitektur
**Tujuan:** Pelanggaran invarian gagal di mesin, bukan di audit.
**Boleh disentuh:** konfigurasi ESLint, `.dependency-cruiser.cjs`, `packages/*/test/arch`.
**Aturan yang dipasang:**
- `core` tidak boleh mengimpor `react`, `react-dom`, atau memakai global `window`/`document`.
- `apps/web` dilarang membandingkan `.type` dengan literal tipe elemen (`no-restricted-syntax`).
- `apps/web` tidak boleh mengimpor dari `core/**/internal`.
- **Tidak ada impor dari rujukan v1:** berkas di `packages/` dan `apps/` dilarang mengimpor apa pun yang menunjuk ke `docs/` atau `legacy-src` (dependency-cruiser `forbidden` dan ESLint `no-restricted-imports`).
**Kriteria penerimaan:**
- Tes `arch/core-purity.test.ts`: file contoh di `core` yang mengimpor `react` membuat `pnpm depcheck` gagal (fixture sementara dibuat dan dihapus oleh tes).
- Tes `arch/no-type-branching.test.ts`: file contoh dengan `el.type === 'text'` di `apps/web` membuat `pnpm lint` gagal.
- Tes `arch/no-legacy-import.test.ts`: file contoh di `packages/core/src` yang berisi `import '../../../docs/legacy-src/mazeGenerator'` membuat `pnpm depcheck` gagal (fixture sementara).
- `pnpm check` tetap hijau pada kode bersih.
**Di luar cakupan:** aturan gaya kode lain.
**Bukti:** output ketiga tes.
