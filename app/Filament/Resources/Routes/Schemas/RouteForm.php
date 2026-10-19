<?php

namespace App\Filament\Resources\Routes\Schemas;

use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class RouteForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informasi rute')->schema([
                    TextInput::make('origin')->label('Kota asal')->required()->maxLength(120),
                    TextInput::make('destination')->label('Kota tujuan')->required()->maxLength(120),
                    TextInput::make('slug')->required()->unique(ignoreRecord: true)->maxLength(180),
                    TextInput::make('service_type')->label('Jenis layanan')->required()->maxLength(120),
                    TextInput::make('fare_note')->label('Catatan tarif')->default('Hubungi kami untuk informasi tarif')->maxLength(180),
                    Textarea::make('summary')->label('Ringkasan')->rows(3)->columnSpanFull(),
                    Checkbox::make('is_featured')->label('Tampilkan di beranda'),
                    Checkbox::make('is_active')->label('Aktif')->default(true),
                ])->columns(2),
            ]);
    }
}
