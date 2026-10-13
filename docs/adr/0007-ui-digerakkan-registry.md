# ADR-0007: UI digerakkan registry dan kapabilitas
**Status:** Diterima
**Konteks:** V1 membocorkan kontrol antar tipe karena pengelompokan `isVisual` dan percabangan `type ===`.
**Keputusan:** Tipe elemen terdaftar di registry dengan `capabilities` dan `propertySchema`. UI hanya membaca keduanya. Aturan ESLint melarang `type ===` di `apps/web`.
**Konsekuensi:** Calendar, Tracker, atau Shape baru tidak mengubah komponen shell. Batas 6 kontrol floating bar nanti memerlukan `ControlZone`/`ControlPriority` (ditunda).
