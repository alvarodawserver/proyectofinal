<?php

namespace App\Http\Controllers;

use App\Models\Habitacione;
use App\Models\Reserva;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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

        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Debes iniciar sesión para reservar.');
        }

        $request->validate([
            'hotel_id' => 'required|exists:hoteles,id',
            'fecha_entrada' => 'required|date|after:today',
            'fecha_salida' => 'required|date|after:fecha_entrada',
            'habitaciones' => 'required|array|min:1',
            'habitaciones.*' => 'exists:habitaciones,id',
        ]);

        try {
            return DB::transaction(function () use ($request) {

                $habitacionesOcupadas = Habitacione::whereIn('id', $request->habitaciones)
                    ->whereHas('reservas', function ($query) use ($request) {
                        $query->where('fecha_entrada', '<', $request->fecha_salida)
                              ->where('fecha_salida', '>', $request->fecha_entrada);
                    })->exists();

                if ($habitacionesOcupadas) {
                    return back()->withErrors(['error' => 'Una o más habitaciones ya no están disponibles para esas fechas.']);
                }

                $reserva = Reserva::create([
                    'user_id' => Auth::id(),
                    'hotele_id' => $request->hotel_id,
                    'fecha_entrada' => $request->fecha_entrada,
                    'fecha_salida' => $request->fecha_salida,
                    'adultos' => $request->adultos,
                    'niños' => $request->niños,
                    'total_precio' => $request->precio_total,
                    'estado' => 'confirmada' 
                ]);

                
                $reserva->habitaciones()->attach($request->habitaciones);

                return redirect()->route('mis-reservas')->with('success', '¡Reserva realizada con éxito!');
            });
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Hubo un error al procesar la reserva. Inténtalo de nuevo.']);
        }
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
