<?php

namespace App\Filament\Resources\Vehicles\Schemas;

use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class VehicleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Detail armada')->schema([
                TextInput::make('name')->label('Nama kendaraan')->required()->maxLength(160),
                TextInput::make('category')->label('Kategori')->required()->maxLength(100),
                TextInput::make('capacity')->label('Kapasitas penumpang')->numeric()->minValue(1)->maxValue(99),
                FileUpload::make('image')->label('Foto armada')->image()->directory('fleet')->columnSpanFull(),
                Textarea::make('features')->label('Fitur / catatan')->rows(3)->columnSpanFull(),
                Checkbox::make('is_featured')->label('Tampilkan di beranda'),
                Checkbox::make('is_active')->label('Aktif')->default(true),
            ])->columns(2),
        ]);
    }
}
