<?php

namespace App\Http\Controllers;

use App\Models\Habitacione;
use App\Models\Reserva;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class ReservaController extends Controller
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
        $request->validate([
            'habitacione_id' => 'required|exists:habitaciones,id',
            'fecha_entrada' => 'required|date|after_or_equal:today',
            'fecha_salida' => 'required|date|after:fecha_entrada',
        ]);


        $habitacion = Habitacione::findOrFail($request->habitacione_id);
        $noches = Carbon::parse($request->fecha_entrada)->diffInDays($request->fecha_salida);
        $precioTotal = $noches * $habitacion->tipo->precio_base;


        Reserva::create([
            'user_id' => Auth::user()->id,
            'habitacione_id' => $request->habitacione_id,
            'fecha_entrada' => $request->fecha_entrada,
            'fecha_salida' => $request->fecha_salida,
            'precio_total' => $precioTotal,
            'estado' => 'confirmada', 
        ]);

    return redirect()->back()->with('success', '¡Reserva realizada con éxito!');
}

    /**
     * Display the specified resource.
     */
    public function show(Reserva $reserva)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reserva $reserva)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reserva $reserva)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reserva $reserva)
    {
        //
    }
}
