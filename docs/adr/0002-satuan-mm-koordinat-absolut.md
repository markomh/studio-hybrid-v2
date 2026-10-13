# ADR-0002: Satuan mm dan koordinat absolut per halaman
**Status:** Diterima
**Konteks:** V1 memakai piksel artboard 430 px di kanvas dan 375×520 px di PDF sehingga posisi bergeser.
**Keputusan:** Seluruh geometri dokumen dalam mm, asal di pojok kiri-atas trim. Piksel hanya ada di tampilan (mm × skala zoom).
**Konsekuensi:** Paritas kanvas–PDF bisa dites langsung. Konversi hanya di `core/units`.
