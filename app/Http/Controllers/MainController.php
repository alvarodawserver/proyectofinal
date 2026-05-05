<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Hotele;
use App\Models\Oferta;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MainController extends Controller
{
    public function index()
    {
        $hoy = Carbon::now();

        // 1. HOTELES (Sección general)
        $hoteles = Hotele::with(['images' => fn($q) => $q->where('is_primary', true)])
            ->get()
            ->map(function ($hotel) use ($hoy) {
                // Buscamos el precio base más barato
                $precioBase = DB::table('tipos')
                    ->join('habitaciones', 'tipos.id', '=', 'habitaciones.tipo_habitacion')
                    ->where('habitaciones.hotele_id', $hotel->id)
                    ->min('tipos.precio_base') ?? 0;

                // Buscamos si este hotel tiene una oferta activa justo ahora
                $oferta = $hotel->ofertas
                    ->where('activa', true)
                    ->where('fecha_inicio', '<=', $hoy)
                    ->where('fecha_fin', '>=', $hoy)
                    ->first();

                $precioFinal = $precioBase;
                if ($oferta) {
                    $precioFinal = $precioBase * (1 - ($oferta->descuento_porcentaje / 100));
                }

                return [
                    'id' => $hotel->id,
                    'nombre' => $hotel->nombre_hotel,
                    'ciudad' => $hotel->ciudad,
                    'categoria' => $hotel->categoria,
                    'imagen' => $hotel->images->first()?->path,
                    'precio_original' => (float)$precioBase,
                    'precio_final' => (float)round($precioFinal, 2),
                    'precio_min' => (float)$hotel->precio_min, 
                    'tiene_oferta' => !!$oferta,
                    'descuento' => $oferta ? $oferta->descuento_porcentaje : 0,
                ];
            });

        $ofertas = Oferta::with(['hotel.images'])
            ->where('activa', true)
            ->where('fecha_inicio', '<=', $hoy)
            ->where('fecha_fin', '>=', $hoy)
            ->get()
            ->map(function ($oferta) {
                $precioMinimoHotel = DB::table('tipos')
                    ->join('habitaciones', 'tipos.id', '=', 'habitaciones.tipo_habitacion')
                    ->where('habitaciones.hotele_id', $oferta->hotel_id)
                    ->min('tipos.precio_base') ?? 0;

                return [
                    'id' => $oferta->id,
                    'nombre_oferta' => $oferta->nombre,
                    'descuento' => (float)$oferta->descuento_porcentaje,
                    'fecha_fin' => $oferta->fecha_fin, 
                    'hotel' => [
                        'id' => $oferta->hotel->id,
                        'nombre' => $oferta->hotel->nombre_hotel,
                        'ciudad' => $oferta->hotel->ciudad,
                        'imagen' => $oferta->hotel->images->where('is_primary', true)->first()?->path 
                                    ?? $oferta->hotel->images->first()?->path,
                        'precio_original' => (float)$precioMinimoHotel,
                        'precio_oferta' => (float)round($precioMinimoHotel * (1 - ($oferta->descuento_porcentaje / 100)), 2),
                    ]
                ];
            });

        return Inertia::render('Main/Home-Page', [
            'hoteles' => $hoteles,
            'ofertas' => $ofertas,
        ]);
    }
}