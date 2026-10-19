<?php

namespace Database\Seeders;

use App\Models\Route;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RouteSeeder extends Seeder
{
    public function run(): void
    {
        $routes = [
            // [origin, destination, featured]
            ['Jakarta', 'Solo', true],
            ['Jakarta', 'Surabaya', true],
            ['Jakarta', 'Malang', true],
            ['Jakarta', 'Bandung', true],
            ['Jakarta', 'Cirebon', false],
            ['Jakarta', 'Pekalongan', false],
            ['Jakarta', 'Purwokerto', false],
            ['Jakarta', 'Tegal', false],
            ['Bandung', 'Yogyakarta', true],
            ['Bandung', 'Semarang', false],
            ['Bandung', 'Malang', false],
            ['Semarang', 'Yogyakarta', false],
            ['Semarang', 'Surabaya', true],
            ['Semarang', 'Malang', false],
            ['Yogyakarta', 'Surabaya', false],
            ['Yogyakarta', 'Malang', false],
            ['Solo', 'Surabaya', false],
            ['Surabaya', 'Malang', true],
        ];

        foreach ($routes as [$origin, $destination, $featured]) {
            Route::updateOrCreate(
                ['slug' => Str::slug("{$origin} {$destination}")],
                [
                    'origin' => $origin,
                    'destination' => $destination,
                    'service_type' => 'Travel antarkota',
                    'summary' => "Tanyakan ketersediaan perjalanan {$origin} menuju {$destination}.",
                    'fare_note' => 'Tarif dikonfirmasi saat inquiry',
                    'is_featured' => $featured,
                    'is_active' => true,
                ],
            );
        }
    }
}
