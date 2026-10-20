<?php

use App\Models\Route as TravelRoute;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $popularRoutes = TravelRoute::query()->where('is_active', true)->where('is_featured', true)->orderBy('origin')->orderBy('destination')->get();
    $allRoutes = TravelRoute::query()->where('is_active', true)->orderBy('origin')->orderBy('destination')->get();

    return view('home', compact('popularRoutes', 'allRoutes'));
})->name('home');

Route::get('/rute', function (Request $request) {
    $routes = TravelRoute::query()->where('is_active', true);

    if ($request->filled('origin')) {
        $origin = $request->string('origin')->toString();
        $routes->where('origin', 'like', "%{$origin}%");
    }

    if ($request->filled('destination')) {
        $destination = $request->string('destination')->toString();
        $routes->where('destination', 'like', "%{$destination}%");
    }

    if ($request->filled('q')) {
        $query = $request->string('q')->toString();
        $routes->where(function ($routeQuery) use ($query) {
            $routeQuery->where('origin', 'like', "%{$query}%")
                ->orWhere('destination', 'like', "%{$query}%")
                ->orWhere('service_type', 'like', "%{$query}%");
        });
    }

    $origins = TravelRoute::query()->where('is_active', true)->pluck('origin')->unique()->sort()->values()->all();
    $dests = TravelRoute::query()->where('is_active', true)->pluck('destination')->unique()->sort()->values()->all();

    return view('routes', ['routes' => $routes->orderBy('origin')->orderBy('destination')->get(), 'origins' => $origins, 'dests' => $dests]);
})->name('routes');

Route::get('/api/rute', function () {
    $format = fn ($query) => $query->where('is_active', true)->orderBy('origin')->orderBy('destination')->get()->map(fn ($route) => [
        'origin' => $route->origin,
        'destination' => $route->destination,
        'slug' => $route->slug,
        'service_type' => $route->service_type,
        'url' => route('route.show', $route->slug),
    ]);

    return response()->json([
        'popular' => $format(TravelRoute::query()->where('is_featured', true)),
        'all' => $format(TravelRoute::query()),
    ]);
})->name('api.routes');

Route::get('/rute/{slug}', function (string $slug) {
    $route = TravelRoute::query()->where('is_active', true)->where('slug', $slug)->firstOrFail();

    return view('route-detail', compact('route'));
})->name('route.show');

Route::get('/armada', function () {
    $fleet = [
        ['name' => 'Mitsubishi Xpander', 'meta' => 'MPV • 6–7 kursi', 'img' => 'images/armada/1.webp'],
        ['name' => 'Toyota Avanza', 'meta' => 'MPV • 6–7 kursi', 'img' => 'images/armada/2.webp'],
        ['name' => 'Suzuki Ertiga', 'meta' => 'MPV • 6–7 kursi', 'img' => 'images/armada/3.webp'],
        ['name' => 'Microbus', 'meta' => 'Bus kecil • 15–19 kursi', 'img' => 'images/armada/4.webp'],
        ['name' => 'Daihatsu Xenia', 'meta' => 'MPV • 6–7 kursi', 'img' => 'images/armada/5.webp'],
        ['name' => 'Toyota Innova', 'meta' => 'MPV • 6–7 kursi', 'img' => 'images/armada/6.webp'],
        ['name' => 'Hyundai H-1 Wagon', 'meta' => 'Van • 7–8 kursi', 'img' => 'images/armada/7.webp'],
        ['name' => 'Hiace Premio', 'meta' => 'Minibus • 13–14 kursi', 'img' => 'images/armada/8.webp'],
        ['name' => 'Hiace Commuter', 'meta' => 'Minibus • 14–15 kursi', 'img' => 'images/armada/9.webp'],
        ['name' => 'Toyota Hiace', 'meta' => 'Minibus • 14–15 kursi', 'img' => 'images/armada/10.webp'],
        ['name' => 'Hiace Luxury', 'meta' => 'Minibus • 10–12 kursi', 'img' => 'images/armada/11.webp'],
        ['name' => 'Alphard Executive', 'meta' => 'Premium • 6–7 kursi', 'img' => 'images/armada/12.webp'],
    ];

    return view('fleet', compact('fleet'));
})->name('fleet');
