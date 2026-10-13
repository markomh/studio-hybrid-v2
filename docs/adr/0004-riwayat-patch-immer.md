# ADR-0004: Undo/Redo dari patch Immer
**Status:** Diterima
**Konteks:** V1 punya dua sistem Undo (Command Pattern dan snapshot halaman).
**Keputusan:** Satu mekanisme: `produceWithPatches`. `transaction(label, fn)` menggabungkan perubahan menjadi satu entri. Riwayat tidak menyimpan data biner.
**Konsekuensi:** Operasi massal (align, hapus beberapa objek) otomatis satu entri.
