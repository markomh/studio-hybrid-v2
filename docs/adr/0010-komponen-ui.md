# ADR-0010: Pustaka komponen UI, ikon, dan sistem token
**Status:** Diusulkan
**Konteks:** Fase 3 membangun cangkang UI tema terang. Butuh token desain konsisten, komponen aksesibel, dan ikon berukuran seragam. V1 menggunakan gaya inline tanpa konsistensi warna maupun kontras, menyebabkan temuan aksesibilitas dan visual yang berantakan.

## Keputusan

### 1. Tailwind CSS v4 — utility-first styling
- **Alasan:** Token desain diterjemahkan langsung ke variabel CSS (`--color-*`, `--spacing-*`). Utility class menghilangkan kebutuhan stylesheet terpisah per komponen. Purge menjamin CSS produksi kecil.
- **Alternatif ditolak:**
  - Vanilla CSS modules — konsisten namun verbose, rawan duplikasi token.
  - CSS-in-JS (Emotion, styled-components) — overhead runtime, besar bundle, tidak cocok SSR/SSG ringan.

### 2. Radix UI Primitives — perilaku aksesibel tanpa opini visual
- **Alasan:** Headless primitives (Dialog, Tooltip, Select, Tabs, Accordion, Switch, Slider, DropdownMenu) menyediakan keyboard navigation, focus management, ARIA attributes tanpa kita tulis sendiri. Kita hanya menambah kelas Tailwind.
- **Alternatif ditolak:**
  - Headless UI — lebih sedikit primitive, tidak ada Accordion/Slider.
  - Menulis dari nol — risiko aksesibilitas tinggi, lambat, rawan bug.
  - shadcn/ui — cocok tapi mengopi banyak kode, mempersulit pembaruan Radix.

### 3. lucide-react — ikon SVG treeshakeable
- **Alasan:** ~1600 ikon, setiap ikon di-import terpisah (tree-shaking). Ukuran per ikon ~200 B gzipped. API prop `size` bawaan menghilangkan ikon tanpa ukuran dari temuan V1.
- **Alternatif ditolak:**
  - react-icons — bundle lebih besar, tidak seseragam.
  - Heroicons — set lebih kecil, bisa kurang.
  - SVG manual — maintenance berat.

### 4. Token desain sebagai variabel CSS
- Semua warna, jarak, radius, dan bayangan didefinisikan di `apps/web/src/ui/tokens.css` sebagai custom properties.
- Komponen Tailwind merujuk token ini melalui konfigurasi `theme.extend`.
- Tema gelap (V2 nanti) menimpa variabel di `:root[data-theme="dark"]`.

### 5. Font UI = font sistem (D-16)
- Font antarmuka: `font-family: system-ui, -apple-system, sans-serif`.
- Font dokumen tetap bundel Liberation/Comic dari `core/fonts`.

## Konsekuensi
- `pnpm install` bertambah Tailwind, PostCSS, autoprefixer, @radix-ui/*, lucide-react.
- Komponen fitur dilarang menulis gaya inline atau warna di luar token.
- Rute dev-only `/ui-kit` menampilkan semua komponen untuk review visual.
- Tes kontras otomatis memastikan token memenuhi WCAG 2.1 AA.
