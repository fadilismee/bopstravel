@extends('layouts.site')
@section('title', $route->origin.' ke '.$route->destination.' — Bob Travel')
@section('content')
<section class="page-hero"><span class="eyebrow">{{ $route->service_type }}</span><h1>{{ $route->origin }} <em>—</em><br>{{ $route->destination }}</h1><p>{{ $route->summary ?: 'Hubungi tim kami untuk informasi perjalanan ini.' }}</p><a class="button button-dark" href="https://wa.me/{{ config('services.whatsapp.number', '6281228746964') }}?text={{ urlencode('Halo Bob Travel, saya ingin bertanya tentang rute '.$route->origin.' ke '.$route->destination) }}" target="_blank" rel="noopener">Tanyakan rute ini <span>↗</span></a></section>
<section class="section"><div class="detail-note"><span class="eyebrow">INFORMASI TARIF</span><h2>{{ $route->fare_note }}</h2><p>Jadwal, ketersediaan, titik penjemputan, dan tarif akhir dikonfirmasi langsung oleh tim saat Anda menghubungi kami. Inquiry belum merupakan konfirmasi pemesanan.</p></div></section>
@endsection