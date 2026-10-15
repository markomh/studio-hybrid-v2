# DATA_MODEL (schemaVersion = 1)

## Satuan dan koordinat
- Semua geometri dalam **milimeter**.
- Titik asal `(0,0)` = pojok kiri-atas **trim** halaman (area setelah dipotong). Sumbu Y ke bawah.
- Area bleed berada di koordinat negatif dan melewati `widthMm`/`heightMm`.
- Posisi elemen **absolut terhadap halaman**, bukan terhadap kotak konten. Margin dan safe zone dihitung terpisah oleh `book/` sesuai peran halaman dan sisi (recto/verso).
- Rotasi dalam derajat searah jarum jam terhadap pusat elemen. Opasitas 0–1.

## Dokumen
```ts
Document = {
  schemaVersion: 1,
  id: string,                    // uuid
  meta: {
    name: string,
    trim: { preset: 'letter'|'a4'|'6x9'|'8.5x8.5'|'custom', widthMm: number, heightMm: number },
    bleedMm: number,             // default 3.175 (0.125 in)
    paper: 'white' | 'cream' | 'color',
    colorMode: 'color' | 'grayscale',
    margins: { topMm, bottomMm, insideMm, outsideMm },
    createdAt: string, updatedAt: string      // ISO 8601
  },
  pages: Page[]                  // urutan = urutan di buku
}

Page = {
  id: string,
  role: 'cover' | 'front_matter' | 'body' | 'solutions' | 'appendix',
  numbering?: { style: 'arabic'|'roman-lower'|'roman-upper'|'none', start?: number, suppressFirst?: boolean },
  border?: 'none' | 'simple' | 'double' | 'rounded' | 'dots',
  elements: Element[]            // urutan array = urutan z (belakang → depan)
}
```
Jumlah halaman dan sisi recto/verso diturunkan dari urutan `pages` (tidak disimpan).

## Elemen
```ts
ElementBase = {
  id: string,
  x: number, y: number, w: number, h: number,   // mm
  rotation: number,                             // derajat
  opacity: number,                              // 0..1
  locked: boolean,
  hidden: boolean
}

TextElement   = ElementBase & { type: 'text',
  text: string, fontFamily: 'sans'|'serif'|'comic'|'mono',
  fontSizePt: number, lineHeight: number, letterSpacingPt: number,
  bold: boolean, italic: boolean, underline: boolean, caps: boolean,
  align: 'left'|'center'|'right', color: string,
  placeholder?: boolean }   // true = teks petunjuk; preflight menandai bila tersisa

ImageElement  = ElementBase & { type: 'image',
  source: { kind: 'asset', assetId: string } | { kind: 'emoji', char: string } | { kind: 'svg', ref: string },
  fit: 'contain'|'cover'|'stretch', flipH: boolean,
  crop?: { x: number, y: number, w: number, h: number } }     // pecahan 0..1

ShapeElement  = ElementBase & { type: 'shape',
  shape: 'rect'|'ellipse'|'line',
  fill: string | null, stroke: string | null, strokeWidthMm: number,
  strokeStyle: 'solid'|'dashed', cornerRadiusMm?: number }

PuzzleElement = ElementBase & { type: 'puzzle', kind: PuzzleKind, seed: number, showSolution: boolean }
  // PuzzleKind = MazeParams | WordSearchParams | SudokuParams | WorksheetParams
  // Hasil generator TIDAK disimpan; dihitung dari (params, seed) dan di-cache di memori.

GroupElement  = ElementBase & { type: 'group', children: Element[] }   // koordinat anak relatif terhadap grup
```

### Parameter puzzle
```ts
MazeParams       = { kind: 'maze', rows, cols, algorithm: 'recursive-backtracker'|'prim'|'kruskal',
                     wallThicknessMm, wallColor, solutionColor, startIcon, finishIcon }
WordSearchParams = { kind: 'wordsearch', size, words: string[], allowDiagonal, allowReverse }
SudokuParams     = { kind: 'sudoku', difficulty: 'easy'|'medium'|'hard' }
WorksheetParams  = { kind: 'worksheet', subject, topic, grade, problemCount }
```
Hanya algoritma yang **benar-benar diimplementasikan dan dites** yang boleh ada di enum.

### Aturan solusi
`showSolution` hidup di elemen. Halaman berperan `solutions` merender puzzle dengan `showSolution = true` melalui perhitungan layout (bukan dengan menyalin data). Hanya ada satu sumber kebenaran.

## Aset
Tabel Dexie `assets`: `{ id, blob, mime, bytes, sha256, widthPx?, heightPx?, createdAt }`. Dokumen hanya menyimpan `assetId`. Batas unggah 5 MB; hanya PNG/JPG (validasi tipe dari isi berkas, bukan ekstensi). DPI efektif = `piksel asli / (ukuran cetak mm / 25.4)`.

## Kapabilitas
```ts
Capabilities = {
  rotate: boolean, flipH: boolean, opacity: boolean,
  typography: boolean, fill: boolean, stroke: boolean,
  engine: { label: string } | null,    // aksi "Acak …"
  solutionKey: boolean
}
```
Aksi universal (kunci, duplikat, hapus, urutan layer, grup) berlaku untuk semua tipe dan tidak dideklarasikan per tipe.

| Tipe | rotate | flipH | opacity | typography | fill | stroke | engine | solutionKey |
| :--- | :-: | :-: | :-: | :-: | :-: | :-: | :--- | :-: |
| text | ya | tidak | tidak | ya | tidak | tidak | — | tidak |
| image | ya | ya | ya | tidak | tidak | tidak | — | tidak |
| shape | ya | ya | ya | tidak | ya | ya | — | tidak |
| maze | tidak | tidak | tidak | tidak | tidak | ya (dinding) | Acak Labirin | ya |
| wordsearch | tidak | tidak | tidak | tidak | tidak | tidak | Acak Kisi | ya |
| sudoku | tidak | tidak | tidak | tidak | tidak | tidak | Generate Baru | ya |
| worksheet | tidak | tidak | tidak | tidak | tidak | tidak | Acak Soal | ya |
| group | — | — | — | — | — | — | — | — |

## Versi dan migrasi
- `schemaVersion` naik setiap perubahan bentuk.
- `migrate(doc: unknown): Document` memvalidasi dan mengangkat versi lama, satu langkah per versi.
- Setiap migrasi punya tes dengan fixture dokumen versi lama.
- Dokumen yang gagal divalidasi tidak boleh menimpa data yang ada: tampilkan galat dan tawarkan ekspor berkas mentah.

## Aturan KDP yang dipindahkan dari versi 1
Gutter menurut jumlah halaman dan lebar punggung dihitung di `book/kdp.ts`. Nilai awal diambil dari `kdpCalculator.ts` v1 dan **wajib dicek ulang terhadap panduan KDP terbaru** sebelum rilis (tabel ditaruh sebagai data, bukan tersebar di kode). Estimasi biaya cetak dan royalti diberi label "perkiraan" dan tanggal data.
