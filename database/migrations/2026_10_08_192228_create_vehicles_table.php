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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->default('Travel');
            $table->unsignedTinyInteger('capacity')->nullable();
            $table->string('image')->nullable();
            $table->text('features')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        DB::table('vehicles')->insert([
            ['name' => 'Toyota HiAce Premio', 'category' => 'Executive Van', 'capacity' => null, 'features' => 'Armada dan kapasitas dikonfirmasi saat pemesanan.', 'is_featured' => true, 'is_active' => true],
            ['name' => 'Toyota Innova Reborn', 'category' => 'MPV', 'capacity' => null, 'features' => 'Armada dan kapasitas dikonfirmasi saat pemesanan.', 'is_featured' => true, 'is_active' => true],
            ['name' => 'Toyota Alphard', 'category' => 'Luxury', 'capacity' => null, 'features' => 'Ketersediaan armada dikonfirmasi saat pemesanan.', 'is_featured' => true, 'is_active' => true],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
