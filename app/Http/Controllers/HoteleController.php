<?php

namespace App\Http\Controllers;

use App\Models\Hotele;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HoteleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Hotele $hotele)
    {
        $hotel = Hotele::with(['images', 'servicios', 'habitaciones.tipo'])->findOrFail($hotele->id);
        $avg_rating = round($hotel->reviews()->avg('valoracion'), 1) ?? 0;
        $num_reviews = $hotel->reviews()->count();

        return Inertia::render('Hoteles/show',[
            'hotel' => $hotel,
            'rating' => [
                'average' => $avg_rating,
                'count' => $num_reviews,
                'description' => $this->getRatingDescription($avg_rating),
            ],
            'images' => $hotel->images->map(fn($img) => asset('storage/' . $img->path)),
            'servicios' => $hotel->servicios->map(fn($srv) => [
                'id' => $srv->id,
                'nombre' => $srv->nombre_servicio,
                'icono' => $srv->icono, 
            ])
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Hotele $hotele)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Hotele $hotele)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hotele $hotele)
    {
        //
    }

    private function getRatingDescription($rating)
    {
        if ($rating >= 9) return 'Excelente';
        if ($rating >= 8) return 'Fabuloso';
        if ($rating >= 7) return 'Muy bueno';
        if ($rating >= 6) return 'Bueno';
        return 'Recomendado';
    }
}
