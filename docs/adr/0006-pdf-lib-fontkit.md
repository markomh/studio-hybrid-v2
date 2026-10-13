# ADR-0006: Renderer PDF dengan pdf-lib + fontkit
**Status:** Diterima
**Konteks:** V1 memakai font inti PDF (Helvetica, Times, Courier) yang tidak di-embed, sehingga berbeda dari kanvas.
**Keputusan:** Embed TTF berlisensi OFL untuk keempat keluarga font (sans, serif, comic, mono) beserta berkas lisensi di `core/fonts/`. Tes memeriksa `emb = yes`. Verifikasi lisensi tiap font sebelum dibundel.
**Konsekuensi:** Ukuran berkas PDF dan bundel sedikit naik; paritas font terjamin.
