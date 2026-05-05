<?php

namespace App\Http\Controllers;

use App\Models\Hotele;
use App\Models\Oferta;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfertaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Ofertas/index', [
            'ofertas' => Oferta::with('hotel')->latest()->get(),
            'hoteles' => Hotele::select('id', 'nombre_hotel')->get()
        ]);
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
        $validated = $request->validate([
        'hotel_id' => 'required|exists:hoteles,id',
        'nombre' => 'required|string|max:255',
        'descuento_porcentaje' => 'required|numeric|min:1|max:90',
        'fecha_inicio' => 'required|date',
        'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        ]);
        Oferta::create($validated + ['activa' => true]);
        return back()->with('success', 'Oferta creada correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Oferta $oferta)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Oferta $oferta)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Oferta $oferta)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Oferta $oferta)
    {
        $oferta->delete();
        return redirect()->back()->with('success', 'Oferta eliminada');
    }

    public function toggle(Oferta $oferta)
    {
        $oferta->update(['activa' => !$oferta->activa]);
        return redirect()->back();
    }
}
