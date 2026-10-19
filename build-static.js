import fs from 'fs';
import path from 'path';

const whatsappNumber = '6281228746964';
const defaultWaUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Halo Bob Travel, saya ingin bertanya tentang perjalanan.')}`;

// 1. Base Layout
function getLayout(title, content, currentNav = '') {
    return `<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <meta name="description" content="Temukan perjalanan antarkota bersama Bob Travel. Cek rute dan tanyakan ketersediaan melalui WhatsApp.">
    <script>try{var t=localStorage.getItem('bob-theme');if(!t&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)t='dark';if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}</script>
    <link rel="stylesheet" href="fonts/fonts.css">
    <link rel="stylesheet" href="css/site.css">
    <link rel="stylesheet" href="css/site-upgrade.css">
    <link rel="stylesheet" href="css/booking.css">
    <link rel="stylesheet" href="css/tiketux-reference.css">
    <link rel="stylesheet" href="css/home-polish.css">
    <link rel="icon" href="images/brand-mark.svg" type="image/svg+xml">
</head>
<body>
<header class="topbar">
    <a class="brand" href="index.html">
        <span class="brand-mark">B</span>
        <span>BOB <b>TRAVEL</b><small>TRAVEL • CHARTER • JOURNEY</small></span>
    </a>
    <nav class="site-nav" aria-label="Navigasi utama">
        <a href="rute.html" class="${currentNav === 'routes' ? 'active' : ''}">Rute</a>
        <a href="armada.html" class="${currentNav === 'fleet' ? 'active' : ''}">Armada</a>
        <a href="#tentang">Bantuan</a>
    </nav>
    <details class="mobile-nav">
        <summary aria-label="Buka menu navigasi"><span></span><span></span><span></span></summary>
        <nav aria-label="Menu navigasi">
            <a href="rute.html">Rute perjalanan</a>
            <a href="armada.html">Pilihan armada</a>
            <a href="#tentang">Bantuan &amp; kontak</a>
        </nav>
    </details>
    <form class="nav-search" action="rute.html" method="get">
        <span>⌕</span>
        <input type="search" name="q" placeholder="Cari rute perjalanan" aria-label="Cari rute Bob Travel">
    </form>
    <div class="header-actions">
        <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Ganti mode gelap/terang" title="Mode Gelap / Terang">
            <span class="theme-icon-light" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            </span>
            <span class="theme-icon-dark" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </span>
        </button>
        <a class="nav-cta" href="${defaultWaUrl}" target="_blank" rel="noopener">Hubungi</a>
    </div>
</header>

<main>
${content}
</main>

<footer class="footer" id="tentang">
    <div class="footer-inner">
        <div>
            <a class="brand brand-light" href="index.html">
                <span class="brand-mark">B</span>
                <span>BOB <b>TRAVEL</b><small>TRAVEL • CHARTER • JOURNEY</small></span>
            </a>
            <p>Setiap perjalanan, dibuat lebih nyaman.</p>
        </div>
        <div>
            <b>Jelajahi</b>
            <a href="rute.html">Rute perjalanan</a>
            <a href="armada.html">Pilihan armada</a>
        </div>
        <div>
            <b>Kontak</b>
            <a href="https://wa.me/${whatsappNumber}" target="_blank" rel="noopener">WhatsApp layanan</a>
            <small>Informasi tarif dan ketersediaan dikonfirmasi oleh tim kami.</small>
        </div>
    </div>
    <div class="copyright">© 2026 Bob Travel <span>Perjalanan Anda, prioritas kami.</span></div>
</footer>

<script src="js/image-fallback.js" defer></script>
<script src="js/armada-carousel.js" defer></script>
<script src="js/armada-cards.js" defer></script>
<script src="js/fleet-showcase.js" defer></script>
<script src="js/promo-carousel.js" defer></script>
<script src="js/diskon-carousel.js" defer></script>
<script src="js/article-carousel.js" defer></script>
<script src="js/hero-rotator.js" defer></script>
<script src="js/booking-widget.js" defer></script>
<script src="js/route-tabs.js" defer></script>
<script src="js/navbar-reveal.js" defer></script>
<script src="js/nav-search-popup.js" defer></script>
<script src="js/faq-accordion.js" defer></script>
<script src="js/scroll-reveal.js" defer></script>
<script src="js/theme-toggle.js" defer></script>
<script>
  // Ensure date inputs default to today
  document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(inp => {
      inp.min = today;
    });
  });
</script>
</body>
</html>`;
}

// 2. Build index.html
let bookingHtml = fs.readFileSync('resources/views/home/booking.blade.php', 'utf8');
bookingHtml = bookingHtml.replace(/\{\{\s*date\('Y-m-d'\)\s*\}\}/g, '2026-10-19');

let discoveryHtml = fs.readFileSync('resources/views/home/discovery.blade.php', 'utf8');
discoveryHtml = discoveryHtml.replace(/\/rute/g, 'rute.html');

const homeContent = `
<div class="reference-home">
${bookingHtml}
${discoveryHtml}
</div>
`;

fs.writeFileSync('index.html', getLayout('Bob Travel — Jelajahi Perjalanan', homeContent, 'home'), 'utf8');
console.log('Generated index.html');

// 3. Build armada.html
const fleetList = [
    { name: 'Mitsubishi Xpander', meta: 'MPV • 6–7 kursi', img: 'images/armada/1.jpg' },
    { name: 'Toyota Avanza', meta: 'MPV • 6–7 kursi', img: 'images/armada/2.jpg' },
    { name: 'Suzuki Ertiga', meta: 'MPV • 6–7 kursi', img: 'images/armada/3.jpg' },
    { name: 'Microbus', meta: 'Bus kecil • 15–19 kursi', img: 'images/armada/4.jpg' },
    { name: 'Daihatsu Xenia', meta: 'MPV • 6–7 kursi', img: 'images/armada/5.jpg' },
    { name: 'Toyota Innova', meta: 'MPV • 6–7 kursi', img: 'images/armada/6.jpg' },
    { name: 'Hyundai H-1 Wagon', meta: 'Van • 7–8 kursi', img: 'images/armada/7.jpg' },
    { name: 'Hiace Premio', meta: 'Minibus • 13–14 kursi', img: 'images/armada/8.jpg' },
    { name: 'Hiace Commuter', meta: 'Minibus • 14–15 kursi', img: 'images/armada/9.jpg' },
    { name: 'Toyota Hiace', meta: 'Minibus • 14–15 kursi', img: 'images/armada/10.jpg' },
    { name: 'Hiace Luxury', meta: 'Minibus • 10–12 kursi', img: 'images/armada/11.jpg' },
    { name: 'Alphard Executive', meta: 'Premium • 6–7 kursi', img: 'images/armada/12.jpg' }
];

const fleetCardsHtml = fleetList.map(item => `
<article class="fleet-card">
    <img src="${item.img}" alt="${item.name} Bob Travel" loading="lazy" width="600" height="600">
    <div class="fleet-body">
        <h3>${item.name}</h3>
        <p class="fleet-meta">${item.meta}</p>
        <div class="fleet-stars" role="img" aria-label="Rating 5 dari 5">
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z"/></svg>
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z"/></svg>
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z"/></svg>
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z"/></svg>
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z"/></svg>
        </div>
        <a class="fleet-book" href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Halo Bob Travel, saya ingin booking ' + item.name + '.')}" target="_blank" rel="noopener">Pilih Armada</a>
    </div>
</article>
`).join('');

const fleetContent = `
<section class="page-hero">
    <span class="eyebrow">RUANG UNTUK PERJALANAN ANDA</span>
    <h1>Pilihan armada<br><em>untuk setiap tujuan.</em></h1>
    <p>12 armada nyaman Bob Travel. Pilih kendaraan sesuai kebutuhan, lalu konfirmasi ketersediaannya kepada tim kami.</p>
</section>
<section class="section">
    <div class="fleet-grid fleet-page-grid">
        ${fleetCardsHtml}
    </div>
</section>
`;

fs.writeFileSync('armada.html', getLayout('Pilihan Armada — Bob Travel', fleetContent, 'fleet'), 'utf8');
console.log('Generated armada.html');

// 4. Build rute.html with interactive client-side filter
const routesData = [
    { origin: 'Jakarta', destination: 'Solo', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Jakarta', destination: 'Surabaya', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Jakarta', destination: 'Malang', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Jakarta', destination: 'Bandung', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Jakarta', destination: 'Cirebon', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Jakarta', destination: 'Pekalongan', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Jakarta', destination: 'Purwokerto', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Jakarta', destination: 'Tegal', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Jakarta', destination: 'Semarang', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Jakarta', destination: 'Jogja', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Bandung', destination: 'Yogyakarta', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Bandung', destination: 'Semarang', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Bandung', destination: 'Malang', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Bandung', destination: 'Surabaya', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Semarang', destination: 'Yogyakarta', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Semarang', destination: 'Surabaya', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Semarang', destination: 'Malang', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Yogyakarta', destination: 'Surabaya', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Yogyakarta', destination: 'Malang', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Solo', destination: 'Surabaya', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Surabaya', destination: 'Malang', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' },
    { origin: 'Surabaya', destination: 'Bali', type: 'Travel antarkota', fare: 'Tarif dikonfirmasi saat inquiry' }
];

const origins = [...new Set(routesData.map(r => r.origin))].sort();
const dests = [...new Set(routesData.map(r => r.destination))].sort();

const ruteCardsHtml = routesData.map(r => `
<a class="route-card" href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Halo Bob Travel, saya ingin tanya ketersediaan rute ' + r.origin + ' ke ' + r.destination + '.')}" target="_blank" rel="noopener" data-origin="${r.origin}" data-dest="${r.destination}">
    <div class="route-top">
        <span class="route-tag">${r.type}</span>
        <span class="arrow-circle">↗</span>
    </div>
    <div class="route-line">
        <span class="route-dot"></span>
        <span class="route-dash"></span>
        <span class="route-dot destination-dot"></span>
    </div>
    <div class="route-cities">
        <div><small>ASAL</small><b>${r.origin}</b></div>
        <div><small>TUJUAN</small><b>${r.destination}</b></div>
    </div>
    <p>${r.fare}</p>
</a>
`).join('');

const ruteContent = `
<section class="page-hero">
    <span class="eyebrow">TEMUKAN PERJALANANMU</span>
    <h1>Cari travel<br><em>yang pas buatmu.</em></h1>
    <p>Pilih kota asal dan tujuan. Jadwal serta tarif akan dikonfirmasi tim kami—hasil di bawah adalah informasi rute, bukan ketersediaan kursi.</p>
</section>
<section class="routes-results">
    <form class="results-filter" id="route-filter-form">
        <label>
            <small>ASAL</small>
            <select name="origin" id="filter-origin">
                <option value="">Semua kota asal</option>
                ${origins.map(o => `<option value="${o}">${o}</option>`).join('')}
            </select>
        </label>
        <button class="filter-swap" type="button" aria-label="Tukar kota" id="filter-swap-btn">⇄</button>
        <label>
            <small>TUJUAN</small>
            <select name="destination" id="filter-destination">
                <option value="">Semua kota tujuan</option>
                ${dests.map(d => `<option value="${d}">${d}</option>`).join('')}
            </select>
        </label>
        <label>
            <small>TANGGAL BERANGKAT</small>
            <input type="date" name="date" id="filter-date">
        </label>
        <button class="button button-blue" type="button" id="filter-btn">Cari rute <span>→</span></button>
    </form>

    <div class="results-meta">
        <div>
            <b id="route-count">${routesData.length} rute ditemukan</b>
            <span>Rute aktif yang dapat ditanyakan kepada tim</span>
        </div>
        <span class="results-sort">URUTAN: ASAL A—Z</span>
        <span class="trip-badge" id="route-badge">Sekali Jalan</span>
    </div>

    <div class="route-grid" id="route-cards-container">
        ${ruteCardsHtml}
    </div>
    <div class="no-results" id="route-no-results" style="display:none">
        <span>⌕</span>
        <b>Rute belum ditemukan</b>
        <p>Coba ubah kota asal atau tujuan, atau hubungi tim untuk menanyakan kebutuhan perjalanan khusus.</p>
        <a class="button button-blue" href="${defaultWaUrl}" target="_blank" rel="noopener">Tanya tim kami ↗</a>
    </div>

    <p class="results-disclaimer">Data rute dan tanggal pencarian bukan konfirmasi jadwal, kursi, maupun tiket. Pastikan detail perjalanan langsung dengan operator.</p>
</section>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const originSelect = document.getElementById('filter-origin');
    const destSelect = document.getElementById('filter-destination');
    const swapBtn = document.getElementById('filter-swap-btn');
    const filterBtn = document.getElementById('filter-btn');
    const cards = Array.from(document.querySelectorAll('.route-card'));
    const countEl = document.getElementById('route-count');
    const noResults = document.getElementById('route-no-results');

    // Parse URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get('origin')) originSelect.value = params.get('origin');
    if (params.get('destination')) destSelect.value = params.get('destination');
    if (params.get('q')) {
        const q = params.get('q').toLowerCase();
        const matchOrig = Array.from(originSelect.options).find(o => o.value.toLowerCase().includes(q));
        if (matchOrig) originSelect.value = matchOrig.value;
    }

    const applyFilter = () => {
        const orig = originSelect.value.toLowerCase();
        const dest = destSelect.value.toLowerCase();
        let visibleCount = 0;

        cards.forEach(card => {
            const cardOrig = (card.dataset.origin || '').toLowerCase();
            const cardDest = (card.dataset.dest || '').toLowerCase();
            const matchOrig = !orig || cardOrig.includes(orig);
            const matchDest = !dest || cardDest.includes(dest);

            if (matchOrig && matchDest) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        countEl.textContent = \`\${visibleCount} rute ditemukan\`;
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    };

    if (swapBtn) {
        swapBtn.addEventListener('click', () => {
            const temp = originSelect.value;
            originSelect.value = destSelect.value;
            destSelect.value = temp;
            applyFilter();
        });
    }

    originSelect.addEventListener('change', applyFilter);
    destSelect.addEventListener('change', applyFilter);
    if (filterBtn) filterBtn.addEventListener('click', applyFilter);

    if (params.get('origin') || params.get('destination') || params.get('q')) {
        applyFilter();
    }
});
</script>
`;

fs.writeFileSync('rute.html', getLayout('Cari Travel & Rute — Bob Travel', ruteContent, 'routes'), 'utf8');
console.log('Generated rute.html');
