# F2-5 Generator Worksheet matematika
**Tujuan:** Lembar latihan deterministik tanpa AI.
**Rujukan:** v1 mengambil worksheet dari endpoint AI; tidak ada generator lokal.
**Boleh disentuh:** `packages/core/src/puzzles/worksheet`, tes.
**Isi:** `generateWorksheet({topic, grade, problemCount, seed})` → `{problems:[{id, prompt, answer}]}`. Topik awal: `addition`, `subtraction`, `multiplication`, `pattern`. Rentang angka ditentukan oleh `grade` (tabel konstanta). Pengurangan tidak menghasilkan bilangan negatif untuk kelas rendah. Pola: deret aritmetika dengan satu suku kosong.
**Kriteria penerimaan:**
- `worksheet.test.ts`: untuk setiap soal, `answer` benar (dihitung ulang oleh tes).
- Seed sama menghasilkan soal identik; tidak ada soal ganda dalam satu lembar bila ruang soal cukup.
- Semua operan berada dalam rentang kelas; pengurangan kelas rendah tidak negatif.
- `problemCount` di luar 1–30 menghasilkan galat bertipe.
- Soal pola selalu punya tepat satu suku kosong dan jawaban yang unik.
**Di luar cakupan:** soal cerita, AI, topik sains dan bahasa.
**Bukti:** output Vitest.
