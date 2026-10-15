# F3-A3 Header
**Tujuan:** Header yang jujur dan ringkas: identitas, status simpan, Undo/Redo, menu File, Ekspor.
**Rujukan visual:** `docs/ui-ref/v1-editor-teks.png` (bagian atas).
**Boleh disentuh:** `apps/web/src/shell/header`, `apps/web/src/store` (hanya membaca), `apps/web/src/persistence` (hanya membaca status), tes.
**Dilarang:** menampilkan "Tersimpan" dari sumber selain status persistence; tombol "Bagikan" (D-14).
**Isi:**
- Kiri: logo teks "Studio Hybrid" dan subjudul terpisah jelas; nama proyek yang dapat diedit inline (Enter menyimpan, Esc membatalkan, maksimal 80 karakter, kosong ditolak).
- Status simpan dari persistence: "Menyimpan…", "Tersimpan pukul HH:mm", "Gagal menyimpan" (dengan tombol Coba lagi).
- Undo/Redo dengan `aria-label` dan tooltip yang memuat nama aksi dari riwayat; dinonaktifkan bila kosong.
- Menu File: Proyek baru, Buka proyek (daftar sederhana), Ekspor cadangan `.shbook`, Impor cadangan.
- Mode Fokus (dari F3-A2) dan tombol utama **Ekspor** (membuka dialog; isi dialog di fase 4, kini placeholder yang menyebut "Segera").
**Kriteria penerimaan:**
- Vitest: komponen status menampilkan teks sesuai `idle | saving | saved | error`; "Tersimpan" tidak pernah tampil pada `saving` atau `error`.
- Playwright: ubah nama proyek → reload → nama bertahan; nama kosong ditolak dengan pesan.
- Playwright dengan penyimpanan disimulasikan gagal: header menampilkan "Gagal menyimpan" dan tidak menampilkan "Tersimpan".
- Undo menonaktifkan diri saat riwayat kosong; tooltip menyebut aksi terakhir.
- Tidak ada elemen berlabel "Bagikan" (tes teks).
- Header tidak meluap pada 1024 px.
- `pnpm check` hijau.
**Di luar cakupan:** isi dialog Ekspor, daftar proyek lengkap.
**Bukti:** output tes dan tangkapan layar.
