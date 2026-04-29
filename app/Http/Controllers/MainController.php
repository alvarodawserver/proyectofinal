<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Hotele;
use App\Models\Oferta;
use Illuminate\Support\Facades\DB;

class MainController extends Controller
{
    public function index()
    {
        $hoteles = Hotele::with(['images' => fn($q) => $q->where('is_primary', true)])
            ->get()
            ->map(function ($hotel) {
                return [
                    'id' => $hotel->id,
                    'nombre' => $hotel->nombre_hotel,
                    'ciudad' => $hotel->ciudad,
                    'categoria' => $hotel->categoria,
                    'imagen' => $hotel->images->first()?->path, // Luego en TS añadiremos el prefijo /storage/
                    // Buscamos el precio más barato de sus habitaciones
                    'precio_min' => DB::table('tipos')
                        ->join('habitaciones', 'tipos.id', '=', 'habitaciones.tipo_habitacion')
                        ->where('habitaciones.hotele_id', $hotel->id)
                        ->min('tipos.precio_base') ?? 0,
                ];
            });

        $ofertas = Oferta::with('hotel.images')
            ->where('activa', true)
            ->get();
        return Inertia::render('Main/Home-Page', [

            'hoteles' => $hoteles,
            'ofertas' => $ofertas,
        ]);
    }
}