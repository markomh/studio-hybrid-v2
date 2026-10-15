export const i18n = {
  appName: 'STUDIO HYBRID',
  workspaceSubtitle: 'Activity Book Workspace',
  fileMenu: 'File',
  addText: 'Tambah Teks',
  undo: 'Undo',
  redo: 'Redo',
  status: {
    idle: 'Siap',
    saving: 'Menyimpan...',
    saved: 'Tersimpan',
    error: 'Gagal Menyimpan',
  },
  zoom: 'Perbesaran',
  defaultText: 'Ketik teks di sini...',
  minWidthWarning: 'Gunakan layar yang lebih lebar (minimal 1024 px) untuk menggunakan Studio Hybrid.',
  header: {
    focusMode: 'Mode Fokus',
    exitFocusMode: 'Keluar Mode Fokus',
    tabShortcut: 'Tab',
    utilities: 'Utilitas',
    share: 'Bagikan',
    export: 'Ekspor',
  },
  rail: {
    elements: 'Elemen',
    frame: 'Bingkai',
    pages: 'Halaman',
    add: 'Tambah',
  },
  panel: {
    canvasElements: 'Pustaka Elemen Kanvas',
    puzzles: '1. TEKA-TEKI (PUZZLES)',
    typography: '2. TIPOGRAFI & TEKS',
    clipart: '3. CLIPART & MASKOT',
    clickOrDragCanvas: 'Klik / Drag ke Kanvas',
    clickOrDragText: 'Klik / Drag Teks',
    clickOrDragStickers: 'Klik / Drag Stiker',
    labirin: 'Labirin',
    vectorMaze: 'Vektor Maze',
    sudoku: 'Sudoku',
    grid9x9: 'Grid 9x9',
    wordSearch: 'Word Search',
    searchWord: 'Pencarian Kata',
    worksheet: 'Worksheet',
    mathWorksheet: 'Soal Latihan',
    headingTitle: 'Judul Halaman',
    headingSubtitle: 'Teks heading utama',
    instruction: 'Instruksi & Catatan',
    instructionSubtitle: 'Sub-heading atau keterangan',
    mascotsCharacters: 'MASCOTS & CHARACTERS',
    startGoalIcons: 'START & GOAL ICONS',
    frameSettingsPlaceholder: 'Pengaturan bingkai halaman & margin dokumen.',
    page1Cover: 'Halaman 1 (Cover)',
    activeStatus: 'Aktif',
    page2FrontMatter: 'Halaman 2 (Front Matter)',
    page3Body: 'Halaman 3 (Body)',
  },
  inspector: {
    pageProps: 'Properti Halaman',
    page1: 'Halaman 1',
    formatSetup: 'Format & Page Setup',
    trimSize: 'Ukuran Potong (Trim):',
    bleed: 'Batas Potong (Bleed):',
    bleedActive: 'Aktif (+3.2 mm)',
    gutter: 'Margin Dalam (Gutter):',
    totalPages: 'Total Halaman:',
    pagesTotal: '50 Halaman',
    changePageSetup: '⚙ Ubah Page Setup Dokumen',
    pageContext: 'Konteks Lembar',
    bodyRole: 'BODY',
    sheetNo: 'Nomor Lembar:',
    spreadPos: 'Posisi Spread:',
    gutterSide: 'Sisi Jilidan (Gutter):',
    rectoRight: 'Recto (Kanan)',
    leftEdge: 'Tepi Kiri',
    selectHint: 'Klik atau pilih elemen apa saja pada kanvas untuk mengonfigurasi properti objek.',
    pageFrameSection: 'Bingkai Lembar Halaman',
    borderStyle: 'Gaya Garis Tepi',
    plainBorder: 'Tanpa Bingkai (Polos)',
  },
  footer: {
    pageLabel: 'Hal',
    of: '/',
    recto: 'Recto (Kanan)',
    guides: 'Garis Bantu',
    monochrome: 'Monokrom',
    fit: 'Fit View',
    on: 'ON',
    off: 'OFF',
  },
  uiKit: {
    title: 'UI Kit — Komponen Dasar',
    buttons: 'Tombol',
    icons: 'Ikon',
    formControls: 'Kontrol Formulir',
    feedback: 'Umpan Balik',
    overlays: 'Overlay',
    navigation: 'Navigasi',
  },
} as const;

/** Type for nested dot-notation keys (e.g. 'header.focusMode') */
type FlattenKeys<T, P extends string = ''> = T extends string
  ? P
  : { [K in keyof T & string]: FlattenKeys<T[K], P extends '' ? K : `${P}.${K}`> }[keyof T & string];

export type I18nKey = FlattenKeys<typeof i18n>;

/**
 * Lookup helper: t('header.focusMode') → 'Mode Fokus'.
 * Returns the key itself if not found (fail-visible, never silent).
 */
export function t(key: I18nKey): string {
  const parts = (key as string).split('.');
  let current: unknown = i18n;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return key as string;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : (key as string);
}
