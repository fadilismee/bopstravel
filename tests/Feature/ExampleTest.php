<?php

namespace Tests\Feature;

use App\Models\Route;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200)
            ->assertSee('Cari Tiket Shuttle dan Bus Hari Ini')
            ->assertSee('WAR VOUCHER RECEH BUAT NGABISIN CUTI!');

        $this->assertStringContainsString('/tiketux-reference-assets/', $response->getContent());
        $this->assertStringContainsString('css/tiketux-reference.css', $response->getContent());
        $this->assertSame('text/html; charset=utf-8', $response->headers->get('Content-Type'));
    }

    public function test_routes_and_fleet_pages_load(): void
    {
        $this->get('/rute')->assertOk()->assertSee('Cari travel')->assertSee('TANGGAL BERANGKAT');
        $this->get('/armada')->assertOk()->assertSee('Pilihan armada');
    }

    public function test_route_detail_displays_route_information(): void
    {
        Route::create([
            'origin' => 'Jakarta',
            'destination' => 'Yogyakarta',
            'slug' => 'jakarta-yogyakarta-test',
            'service_type' => 'Travel antarkota',
            'summary' => 'Rute percobaan.',
            'fare_note' => 'Tanyakan tarif',
            'is_featured' => true,
            'is_active' => true,
        ]);

        $this->get('/rute/jakarta-yogyakarta-test')->assertOk()->assertSee('Jakarta')->assertSee('Yogyakarta');
    }
}
