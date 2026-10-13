# ADR-0008: Skema Zod berversi dengan migrasi
**Status:** Diterima
**Konteks:** V1 punya model data ganda (field warisan + `elements[]`).
**Keputusan:** Satu skema `Document` berversi. Muat dan simpan selalu lewat validasi. Migrasi bertahap satu versi per langkah, dengan fixture dan tes.
**Konsekuensi:** Dokumen lama aman dibuka; data korup ditolak tanpa menimpa data yang ada.
