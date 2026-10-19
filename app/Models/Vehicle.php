<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = ['name', 'category', 'capacity', 'image', 'features', 'is_featured', 'is_active'];

    protected function casts(): array
    {
        return ['capacity' => 'integer', 'is_featured' => 'boolean', 'is_active' => 'boolean'];
    }
}
