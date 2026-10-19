@extends('layouts.site')

@section('title', 'Bob Travel — Jelajahi Perjalanan')

@section('content')
<div class="reference-home">
    @include('home.booking')
    @include('home.discovery')
</div>
@endsection
