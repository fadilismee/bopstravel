<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Bob Travel — Perjalanan Lebih Nyaman')</title>
    <meta name="description" content="Temukan perjalanan antarkota bersama Bob Travel. Cek rute dan tanyakan ketersediaan melalui WhatsApp.">
    <link rel="stylesheet" href="{{ asset('fonts/fonts.css') }}">
    <link rel="stylesheet" href="{{ asset('css/site.css') }}">
    <link rel="stylesheet" href="{{ asset('css/site-upgrade.css') }}">
    <link rel="stylesheet" href="{{ asset('css/booking.css') }}">
    <link rel="stylesheet" href="{{ asset('css/tiketux-reference.css') }}">
    <link rel="stylesheet" href="{{ asset('css/home-polish.css') }}?v={{ @filemtime(public_path('css/home-polish.css')) }}">
    <link rel="icon" href="{{ asset('images/brand-mark.svg') }}" type="image/svg+xml">
</head>
<body>
<header class="topbar"><a class="brand" href="{{ route('home') }}"><span class="brand-mark">B</span><span>BOB <b>TRAVEL</b><small>TRAVEL • CHARTER • JOURNEY</small></span></a><nav class="site-nav" aria-label="Navigasi utama"><a href="{{ route('routes') }}">Rute</a><a href="{{ route('fleet') }}">Armada</a><a href="#tentang">Bantuan</a></nav><details class="mobile-nav"><summary aria-label="Buka menu navigasi"><span></span><span></span><span></span></summary><nav aria-label="Menu navigasi"><a href="{{ route('routes') }}">Rute perjalanan</a><a href="{{ route('fleet') }}">Pilihan armada</a><a href="#tentang">Bantuan &amp; kontak</a></nav></details><form class="nav-search" action="{{ route('routes') }}" method="get"><span>⌕</span><input type="search" name="q" value="{{ request('q') }}" placeholder="Cari rute perjalanan" aria-label="Cari rute Bob Travel"></form><div class="header-actions"><a class="nav-cta" href="https://wa.me/{{ config('services.whatsapp.number', '6281228746964') }}?text={{ urlencode('Halo Bob Travel, saya ingin bertanya tentang perjalanan.') }}" target="_blank" rel="noopener">Hubungi</a></div></header>
<main>@yield('content')</main>

<footer class="footer" id="tentang"><div class="footer-inner"><div><a class="brand brand-light" href="{{ route('home') }}"><span class="brand-mark">B</span><span>BOB <b>TRAVEL</b><small>TRAVEL • CHARTER • JOURNEY</small></span></a><p>Setiap perjalanan, dibuat lebih nyaman.</p></div><div><b>Jelajahi</b><a href="{{ route('routes') }}">Rute perjalanan</a><a href="{{ route('fleet') }}">Pilihan armada</a></div><div><b>Kontak</b><a href="https://wa.me/{{ config('services.whatsapp.number', '6281228746964') }}" target="_blank" rel="noopener">WhatsApp layanan</a><small>Informasi tarif dan ketersediaan dikonfirmasi oleh tim kami.</small></div></div><div class="copyright">© {{ date('Y') }} Bob Travel <span>Perjalanan Anda, prioritas kami.</span></div></footer>
<script src="{{ asset('js/image-fallback.js') }}" defer></script>
<script src="{{ asset('js/armada-carousel.js') }}?v={{ @filemtime(public_path('js/armada-carousel.js')) }}" defer></script>
<script src="{{ asset('js/armada-cards.js') }}?v={{ @filemtime(public_path('js/armada-cards.js')) }}" defer></script>
<script src="{{ asset('js/fleet-showcase.js') }}?v={{ @filemtime(public_path('js/fleet-showcase.js')) }}" defer></script>
<script src="{{ asset('js/promo-carousel.js') }}?v={{ @filemtime(public_path('js/promo-carousel.js')) }}" defer></script>
<script src="{{ asset('js/diskon-carousel.js') }}?v={{ @filemtime(public_path('js/diskon-carousel.js')) }}" defer></script>
<script src="{{ asset('js/article-carousel.js') }}?v={{ @filemtime(public_path('js/article-carousel.js')) }}" defer></script>
<script src="{{ asset('js/hero-rotator.js') }}" defer></script>
<script src="{{ asset('js/booking-widget.js') }}?v={{ @filemtime(public_path('js/booking-widget.js')) }}" defer></script>
<script src="{{ asset('js/route-tabs.js') }}" defer></script>
<script src="{{ asset('js/navbar-reveal.js') }}" defer></script>
<script src="{{ asset('js/nav-search-popup.js') }}?v={{ @filemtime(public_path('js/nav-search-popup.js')) }}" defer></script>
<script src="{{ asset('js/faq-accordion.js') }}" defer></script>
<script src="{{ asset('js/scroll-reveal.js') }}" defer></script>
</body></html>