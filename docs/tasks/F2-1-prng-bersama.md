# F2-1 PRNG bersama dan larangan acak liar
**Tujuan:** Satu sumber acak deterministik untuk semua generator.
**Boleh disentuh:** `packages/core/src/puzzles/rng.ts`, konfigurasi ESLint, tes.
**Dilarang:** menyentuh generator lain di kartu ini.
**Isi:** `createRng(seed: number)` (mulberry32 atau setara) dengan `next()`, `int(min, max)`, `pick(array)`, `shuffle(array)` yang tidak memutasi masukan; `deriveSeed(seed, label)` untuk seed turunan. Aturan ESLint: `Math.random` dan `Date.now` dilarang di `packages/core/src/puzzles/**`.
**Kriteria penerimaan:**
- `rng.test.ts`: seed sama menghasilkan 1.000 nilai pertama yang identik; seed berbeda menghasilkan urutan berbeda; **seed 0 valid** dan deterministik.
- `shuffle` mengembalikan permutasi (elemen sama, urutan berbeda untuk seed tertentu) dan tidak mengubah larik asli.
- `int(1, 6)` pada 60.000 sampel menghasilkan setiap nilai antara 9.000 dan 11.000 kali (uji kewarasan distribusi).
- `pnpm lint` gagal pada file contoh di `puzzles/` yang memakai `Math.random`.
**Di luar cakupan:** generator.
**Bukti:** output Vitest dan lint.
