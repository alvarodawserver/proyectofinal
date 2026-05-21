<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Reserva;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReviewController extends Controller
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
        // 1. Validamos que nos llegue todo lo necesario desde React
        $request->validate([
            'reserva_id' => 'required|exists:reservas,id',
            'hotele_id' => 'required|exists:hoteles,id',
            'valoracion' => 'required|integer|min:1|max:5', // Ajusta a 'rating' si tu columna se llama así
            'comentario' => 'required|string|max:1000',
        ]);

        $hoy = Carbon::now();

        // 2. Buscamos la reserva y nos aseguramos de que pertenezca al usuario logueado
        $reserva = Reserva::where('id', $request->reserva_id)
            ->where('user_id', auth()->id())
            ->first();

        if (!$reserva) {
            return redirect()->back()->withErrors([
                'error' => 'No se ha encontrado la reserva o no tienes permiso para comentarla.'
            ]);
        }

        if (Carbon::parse($reserva->fecha_fin)->endOfDay()->isFuture()) {
            return redirect()->back()->withErrors([
                'error' => 'No puedes dejar una reseña hasta que la fecha de tu estancia haya terminado.'
            ]);
        }
        $yaTieneReview = Review::where('reserva_id', $request->reserva_id)->exists();
        
        if ($yaTieneReview) {
            return redirect()->back()->withErrors([
                'error' => 'Ya has dejado una valoración para esta reserva específica.'
            ]);
        }

        Review::create([
            'user_id' => auth()->id(),
            'hotele_id' => $request->hotele_id,
            'reserva_id' => $request->reserva_id,
            'valoracion' => $request->valoracion, 
            'comentario' => $request->comentario,
        ]);

        return redirect()->back()->with('success', '¡Gracias! Tu opinión se ha guardado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Review $review)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Review $review)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        //
    }
}