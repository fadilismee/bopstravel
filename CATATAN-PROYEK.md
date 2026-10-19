# Catatan Proyek — Bob Travel (armada-trans-java)

> File ini berisi catatan penting agar tidak lupa: ukuran aset, konfigurasi, dan batasan pengerjaan.
> Diperbarui: 18 Okt 2026.

## 1. Ukuran Poster & Gambar (acuan ganti aset)

`object-fit: cover` dipakai di banner tipis & promo, jadi ukuran pengganti boleh beda
dikit — yang penting **rasionya mirip**.

| Bagian | File sekarang | Ukuran asli | Rasio acuan |
|---|---|---|---|
| Banner tipis tengah (slide 1) | `public/tiketux-reference-assets/armada/armada-slider-1.png` | **2049×1050** | ± 2:1 |
| Banner tipis tengah (slide 2) | `public/tiketux-reference-assets/armada/armada-slider-2.jpg` | **1366×700** | ± 2:1 |
| Render banner tipis di web | CSS `aspect-ratio: 1024 / 145` (± 7:1, tipis) | — | 7:1 |
| Promo & Info (slide 1) | `public/tiketux-reference-assets/1789953791-30.webp` | **1801×701** | ± 2,5:1 |
| Promo & Info (slide 2) | `public/tiketux-reference-assets/1791192106-51.webp` | **3602×1402** | ± 2,5:1 |
| Promo & Info (slide 3) | `public/tiketux-reference-assets/1789539873-20.webp` | **3602×1400** | ± 2,5:1 |
| Penawaran/berita (3 kartu) | `1763355543-24.webp`, `1762308601-63.webp`, `1757561526-46.webp` | **1515×701** semua | ± 2,1:1 |
| Gambar HP CTA bawah | `image-download-1.DNdVHY8f.webp` / `image-download-2.j-x2fFAL.webp` | **309×464** / **310×465** (portrait) | ± 2:3 |
| Kartu armada (12) | `public/images/armada/1.jpg` s/d `12.jpg` | **2000×2000** (kotak) | 1:1 |
| Hero | `public/images/hero-*.jpg` (bus, minibus, borobudur, malioboro, roadtrip) | **1512×1048** s/d **1920×1440** (landscape) | landscape |
| Logo operator (kartu diskon) | `public/tiketux-reference-assets/operator/logo/bg-white/*.png` | **35×35** / **210×210** | kotak |

## 2. Branding & Kontak

- Nama: **Bob Travel** (`APP_NAME`), logo huruf **B**, favicon `images/brand-mark.svg`.
- WhatsApp default: **6281228746964**, teks sapaan *"Halo Bob Travel"*.
  Config: `config/services.php` → `services.whatsapp.number` (bisa dioverride via `.env` `WHATSAPP_NUMBER`).
- Tagline footer: *"Setiap perjalanan, dibuat lebih nyaman."*

## 3. Batasan Pengerjaan (standing constraint dari owner)

- **JANGAN clone 100% Tiketux** (copyright / out-of-scope) — kejar functional-parity dengan desain original.
- **JANGAN ubah tataan layout / UI-UX** — yang boleh diubah hanya section jarak, rasio, teks,
  dan yang nampak/interface. (Instruksi verbatim owner, dipertahankan.)
- Semua gambar harus **lokal** (tidak ada request keluar). Khusus **hero** boleh diganti
  (bus, minibus, destinasi Jawa & DIY); gambar lain **jangan diganti/dihilangkan**, hanya dilokalisasi.
- Commit **hanya** saat owner bilang "commit".

## 4. Demo Lokal

- Server: `php artisan serve --host=127.0.0.1 --port=8000` (PHP Laragon `php-8.3.33-Win32-vs16-x64`).
- Jangan restart server tanpa diminta, kecuali owner bilang "jalankan".
- Framework: Laravel 13 + Filament 5 + SQLite lokal. CSS acuan `tiketux-reference.css`
  (compiled Tailwind, **read-only** — kelas arbitrary baru TIDAK tersedia di sana;
  custom style wajib lewat `public/css/home-polish.css` yang di-load TERAKHIR).
- Cache-buster CSS: `home-polish.css?v=filemtime(...)`. Setelah ubah Blade: `php artisan view:clear`.

## 5. Struktur Penting

- `routes/web.php` (closure): `/` home, `/api/rute` {popular, all}, `/rute` (filter LIKE
  origin/destination + q + date/trip passthrough), `/rute/{slug}`, `/armada` (12 item `$fleet`).
- `resources/views/home/discovery.blade.php` — satu baris raksasa (±89KB), berisi semua section home.
- Section CTA bawah (`cta-section`/`cta-banner`) — markup + style custom sendiri di
  `home-polish.css` (§18). **Sudah dikeluarkan dari kolom FAQ** (dulu kejebak di
  `div.lg:w-6/12` kolom kanan FAQ sehingga sempit & ketutup gambar).
- JS: `booking-widget.js`, `route-tabs.js`, `promo-carousel.js`, `diskon-carousel.js`
  (sapuan manual voucher "Sedang Diskon"; HP 1 kartu/layar, desktop tetap 3),
  `article-carousel.js` (sapuan manual "Penawaran Spesial & Berita"; pola sama diskon-carousel.js,
  HP 1 kartu/layar, desktop tetap 3; layout kartu TIDAK diubah),
  `hero-rotator.js`, `fleet-showcase.js`, `navbar-reveal.js`, `faq-accordion.js`, `scroll-reveal.js`.
- Semua carousel home (promo, banner armada tengah, "Sedang Diskon", pilihan armada,
  "Penawaran Spesial & Berita") bisa digeser manual (drag mouse + sapuan jari);
  scroll vertikal halaman tetap jalan.
- Fix artikel "aneh" (18 Okt 2026): 3 slide kosong `animate-pulse` diisi gambar lokal reuse
  (slide 4-6 pakai ulang 3 webp 1515×701 yang sama, tanpa ganti/hapus gambar);
  `img.blog-img` diganti `object-contain`+bg putih → `object-fit:cover;object-position:center`
  (CSS §15 `.article-carousel`, bg `#eef4fb` biar letterbox tidak putih);
  bukti visual `storage/app/shot/artikel-desktop.png` + `artikel-phone.png`
  (6 img 345×180 penuh, pulse 0).
- Batch-5 catatan owner (18 Okt 2026, `home-polish.css` §21–§24 + JS):
  §21 search widget fused (tabs putih + border `#e8edf3`, radius 20px, overlap -1px,
  card radius `0 20px 20px 20px` + shadow; HP 16px/22px) — tanpa ubah layout;
  §22 link "Lihat Semua Promo & Informasi" dirapatkan (desktop mt20/mb36, HP mt16/mb28);
  §23 navbar search popup (tertutup lingkaran 44px + border/bg `#f8fafc`;
  terbuka 280px/50vw, HP 300px/78vw; input padding-left 32px biar teks tidak numpuk ikon ⌕);
  `faq-accordion.js` eksklusif (satu buka, lain nutup); `nav-search-popup.js` baru
  (klik buka+focus, Esc tutup, klik-luar tutup jika kosong, blur kosong tutup 150ms,
  submit Enter normal ke `/rute?q`); `diskon-carousel.js` auto 4,5 detik + manual
  (pause saat hover/focus/hidden/drag; hormati reduced-motion).
  §24 netralkan `bg-section-promo` bawaan referensi (`/_nuxt/*.webp` 404, tidak ada
  di proyek) jadi gradasi terang lokal — layout/struktur section sama.
  Root cause auto-diskon diam di desktop: section cuma 3 slide vs tampil 3-up
  (maxIndex 0 → `go()` selalu bungkus ke 0, `paint()` reset `''`, T1 selalu `""`).
  Fix: clone-loop (gandakan 3 slide jadi 6, id di dalam clone dibuang biar unik),
  lalu bungkus 0..max normal. Sintaks JS lolos `node --check`.
  Bukti batch-5: `storage/app/shot/batch5-hero.png`, `batch5-navpopup.png`,
  `batch5-phone-hero.png`, `batch5-phone-link.png` + `pptr/dbg5.cjs`, `pptr/cdp-batch5.cjs`.
  Sisa live-verify (server sempat killed low-memory 18 Okt, belum direstart):
  jalankan ulang `dbg5.cjs` (T1 mesti `translateX(...)` bukan `""`), screenshot ulang
  bukti gerak + navpopup padding fix.

## 6. Pending / Belum Diputuskan Owner

- [ ] Foto armada ada watermark **MELASTY TRAVEL** baked-in → opsi: crop bawah / overlay / cari sumber bersih.
- [ ] Optionals (tanpa perintah, jangan dikerjakan): atribusi CC foto hero, `WHATSAPP_NUMBER` di `.env`,
      polish tabel Filament, trip pp/oj baru passthrough ke `/rute`.
- [ ] Optimasi UI/UX **mode HP** — fix §19 di `home-polish.css` SUDAH ditulis
  (preview 390px: `storage/app/shot/mtest.png`; hero judul wrap 27px, kartu
  search stack vertikal + tombol full-width, `-mx-*` dinetralkan anti-kepotong
  kanan, judul `whitespace-nowrap` wrap, grid layanan 3→1 kolom).
  Sisa: screenshot ulang 390px sebagai bukti visual + `view:clear`.
