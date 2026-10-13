# ADR-0005: Local-first dengan IndexedDB (Dexie)
**Status:** Diterima (keputusan produk: rilis pertama tanpa akun)
**Konteks:** V1 tidak menyimpan apa pun namun menampilkan "Tersimpan".
**Keputusan:** Dokumen dan aset disimpan di IndexedDB. Gambar sebagai Blob, bukan data URL. Autosave debounce 800 ms dengan status nyata. Cadangan lewat berkas `.shbook`. Meminta `navigator.storage.persist()`.
**Konsekuensi:** Data hanya ada di satu perangkat; pengguna perlu diingatkan membuat cadangan. Sinkron lintas perangkat ditunda (kandidat: Supabase) dan tidak boleh mengubah skema dokumen.
