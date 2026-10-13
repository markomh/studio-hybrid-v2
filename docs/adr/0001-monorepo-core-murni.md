# ADR-0001: Monorepo dengan `core` murni
**Status:** Diterima
**Konteks:** Di v1 logika, UI, dan state bercampur sehingga tidak bisa dites tanpa browser.
**Keputusan:** pnpm workspace dengan `packages/core` (TypeScript tanpa React/DOM) dan `apps/web`. dependency-cruiser menolak impor `react` dari `core`.
**Konsekuensi:** Generator, layout, preflight, dan PDF bisa dites di Node. Biaya: sedikit lebih banyak konfigurasi awal.
