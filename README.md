# bopstravel

Frontend static website untuk Bob Travel (Armada Trans Java) - Travel, Charter, Journey.
Dibuat sebagai versi statis (HTML5, CSS3, Vanilla JS) untuk kebutuhan preview sementara di Vercel tanpa dependency backend PHP/Laravel.

## 🌟 Fitur Utama
- **Landing Page Interaktif**: Hero slider, booking widget interaktif, promo carousel, armada preview, FAQ accordion, dan testimoni.
- **Halaman Rute (`/rute`)**: Pencarian kota asal & tujuan dengan filter real-time client-side, swap origin-destination, dan tombol inquiry WhatsApp.
- **Halaman Armada (`/armada`)**: Showcase 12 armada kendaraan lengkap dengan spesifikasi kapasitas, rating bintang, dan booking langsung ke WhatsApp.
- **Dark Mode & Light Mode**: Dukungan tema Midnight Slate Navy dengan toggle instan, tersimpan otomatis di `localStorage` dan responsif terhadap preferensi sistem OS.
- **Clean URLs di Vercel**: Dilengkapi konfigurasi `vercel.json` untuk routing `/rute`, `/armada`, dan `/api/rute`.
- **Mock API**: `/api/rute` menyajikan data JSON rute populer dan rute lengkap.

## 🚀 Panduan Deploy ke Vercel
1. Buka [Vercel Dashboard](https://vercel.com/dashboard).
2. Klik **Add New** > **Project**.
3. Import repository GitHub `fadilismee/bopstravel`.
4. Pengaturan Framework Preset: **Other**.
5. Root Directory: `./` (default).
6. Klik **Deploy**. Website akan langsung aktif dalam beberapa detik.
