<?php

namespace App\Http\Controllers;

use App\Models\Hotele;
use App\Models\Oferta;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HoteleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $hoteles = Hotele::withCount('habitaciones')->get();
        
        return Inertia::render('Hoteles/Admin/index', [
            'hoteles' => $hoteles
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Hoteles/Admin/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre_hotel' => 'required|string|max:255',
            'propietario_id' => 'required|exists:users,id',
            'direccion' => 'required|string|max:255',
            'ciudad' => 'required|string|max:255',
            'latitud' => 'required|numeric',
            'longitud' => 'required|numeric',
            'descripcion' => 'nullable|string',
        ]);

        Hotele::create([
            'propietario_id' => Auth::user()->id,
            ...$validated
        ]);
        return redirect()->back()->with('success', 'Hotel creado exitosamente.');}

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Hotele $hotel) // <--- Añadimos el Request
{
    // Mantenemos tu carga de relaciones
    $hotel = Hotele::with(['images', 'servicios', 'habitaciones.tipo'])->findOrFail($hotel->id);

    // --- LÓGICA DE OFERTAS ---
    $ofertaAplicada = null;
    if ($request->has('oferta_id')) {
        $ofertaAplicada = Oferta::where('id', $request->oferta_id)
            ->where('hotel_id', $hotel->id)
            ->where('activa', true)
            ->where('fecha_inicio', '<=', now())
            ->where('fecha_fin', '>=', now())
            ->first();
    }
    // -------------------------

    $avg_rating = round($hotel->reviews()->avg('valoracion'), 1) ?? 0;
    $num_reviews = $hotel->reviews()->count();

    return Inertia::render('Hoteles/show', [
        'hotel' => $hotel,
        'oferta_aplicada' => $ofertaAplicada, // <--- Pasamos la oferta (será null si no hay)
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
        $propietarios = User::role('propietario')->get(['id', 'name']);

        return Inertia::render('Hoteles/Admin/edit', [
            'hotel' => $hotele,
            'propietarios' => $propietarios
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Hotele $hotele)
    {
        $validated = $request->validate([
            'nombre_hotel' => 'required|string|max:255',
            'propietario_id' => 'required|exists:users,id',
            'direccion' => 'required|string|max:255',
            'ciudad' => 'required|string|max:255',
            'latitud' => 'required|numeric',
            'longitud' => 'required|numeric',
            'descripcion' => 'nullable|string',
        ]);

        $hotele->update($validated);

        return redirect()->route('hoteles.index')->with('success', 'Hotel actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hotele $hotele)
    {
        $hotele->delete();
        return redirect()->route('hoteles.index')->with('success', 'Hotel eliminado exitosamente.');
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
