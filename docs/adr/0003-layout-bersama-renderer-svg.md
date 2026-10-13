# ADR-0003: Satu layout, dua renderer (SVG dan PDF)
**Status:** Diterima
**Konteks:** Pemenggalan teks di CSS browser dan di jsPDF berbeda; font kanvas berbeda dari font PDF.
**Keputusan:** `core/layout` mengukur dan memenggal teks dengan fontkit memakai font yang sama yang di-embed ke PDF, lalu menghasilkan primitif (garis teks, rect, path). Kanvas SVG menggambar tiap garis teks pada posisi eksplisit.
**Konsekuensi:** Pemenggalan identik. Biaya: teks tidak diedit inline oleh browser; pengeditan lewat kotak input yang memicu layout ulang.
