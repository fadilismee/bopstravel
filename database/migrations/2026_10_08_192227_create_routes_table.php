<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('routes', function (Blueprint $table) {
            $table->id();
            $table->string('origin');
            $table->string('destination');
            $table->string('slug')->unique();
            $table->string('service_type')->default('Travel reguler');
            $table->text('summary')->nullable();
            $table->string('fare_note')->default('Hubungi kami untuk informasi tarif');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        DB::table('routes')->insert([
            ['origin' => 'Jakarta', 'destination' => 'Yogyakarta', 'slug' => 'jakarta-yogyakarta', 'service_type' => 'Travel antarkota', 'summary' => 'Tanyakan ketersediaan perjalanan Jakarta menuju Yogyakarta.', 'fare_note' => 'Tarif dikonfirmasi saat inquiry', 'is_featured' => true, 'is_active' => true],
            ['origin' => 'Jakarta', 'destination' => 'Semarang', 'slug' => 'jakarta-semarang', 'service_type' => 'Travel antarkota', 'summary' => 'Tanyakan ketersediaan perjalanan Jakarta menuju Semarang.', 'fare_note' => 'Tarif dikonfirmasi saat inquiry', 'is_featured' => true, 'is_active' => true],
            ['origin' => 'Bandung', 'destination' => 'Surabaya', 'slug' => 'bandung-surabaya', 'service_type' => 'Perjalanan antarkota', 'summary' => 'Hubungi tim untuk informasi rute Bandung menuju Surabaya.', 'fare_note' => 'Tarif dikonfirmasi saat inquiry', 'is_featured' => true, 'is_active' => true],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('routes');
    }
};
