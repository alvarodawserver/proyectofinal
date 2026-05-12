<?php

namespace App\Http\Controllers;

use App\Models\Habitacione;
use App\Models\Reserva;
use App\Models\Oferta;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReservaController extends Controller
{
    public function index()
    {
        $reservas = Reserva::with(['habitaciones.hotele', 'habitaciones.tipo'])
            ->where('user_id', auth()->id())
            ->whereIn('estado', ['pagada', 'cancelada'])
            ->orderBy('fecha_entrada', 'desc')
            ->get();

        return inertia('Reservas/mis-reservas', [
            'reservas' => $reservas
        ]);
    }

    /**
     * Procesa el "checkout" del carrito: Crea la reserva con varias habitaciones.
     */
    public function store(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Debes iniciar sesión para reservar.');
        }


        $request->validate([
            'hotel_id' => 'required|exists:hoteles,id',
            'habitaciones' => 'required|array|min:1',
            'habitaciones.*' => 'exists:habitaciones,id',
            'fecha_entrada' => 'required|date|after_or_equal:today',
            'fecha_salida' => 'required|date|after:fecha_entrada',
            'oferta_id' => 'nullable|exists:ofertas,id',
        ]);

        $entrada = $request->fecha_entrada;
        $salida = $request->fecha_salida;
        $habitacionesIds = $request->habitaciones;

       
        foreach ($habitacionesIds as $hId) {
            $yaReservada = Reserva::where('estado', 'pagada')
                ->whereHas('habitaciones', function ($q) use ($hId) {
                    $q->where('habitaciones.id', $hId);
                })
                ->where(function ($q) use ($entrada, $salida) {
                    $q->where('fecha_entrada', '<', $salida)
                      ->where('fecha_salida', '>', $entrada);
                })
                ->exists();

            if ($yaReservada) {
                // Buscamos el nombre de la habitación para un error más descriptivo
                $h = Habitacione::find($hId);
                return back()->with('error', "La habitación {$h->id} ya no está disponible para estas fechas. Alguien ha sido más rápido.");
            }
        }

        try {
            return DB::transaction(function () use ($request, $habitacionesIds) {
                
                $totalCalculado = 0;
                foreach ($habitacionesIds as $hId) {
                    $totalCalculado += $this->calcularPrecio(
                        $hId, 
                        $request->fecha_entrada, 
                        $request->fecha_salida, 
                        $request->oferta_id
                    );
                }

                $reserva = Reserva::create([
                    'user_id'       => Auth::id(),
                    'oferta_id'     => $request->oferta_id,
                    'estado'        => 'pendiente', 
                    'fecha_entrada' => $request->fecha_entrada,
                    'fecha_salida'  => $request->fecha_salida,
                    'precio_total'  => $totalCalculado,
                ]);

                $reserva->habitaciones()->attach($habitacionesIds);

                return redirect()->route('reservas.carrito')->with('success', 'Añadido al carrito correctamente.');
            });
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al procesar la reserva: ' . $e->getMessage()]);
        }
    }

    /**
     * Lógica para calcular el precio por noche y aplicar ofertas.
     */
    private function calcularPrecio($habitacionId, $entrada, $salida, $ofertaId = null)
    {
        $habitacion = Habitacione::with('tipo')->findOrFail($habitacionId);
        
        $f1 = Carbon::parse($entrada);
        $f2 = Carbon::parse($salida);
        $noches = $f1->diffInDays($f2);

        $precioPorNoche = $habitacion->tipo->precio_base ?? 0;
        $precioTotalBase = $precioPorNoche * $noches;

        if ($ofertaId) {
            $oferta = Oferta::find($ofertaId);
            if ($oferta && $oferta->descuento_porcentaje > 0) {
                $descuento = ($precioTotalBase * $oferta->descuento_porcentaje) / 100;
                $precioTotalBase -= $descuento;
            }
        }

        return $precioTotalBase;
    }

    public function getCart()
    {
        $items = Reserva::with(['habitaciones.tipo', 'habitaciones.hotele', 'oferta']) 
            ->where('user_id', Auth::id())
            ->where('estado', 'pendiente')
            ->get();

        return Inertia::render('Reservas/carrito', [
            'items' => $items
        ]);
    }

    public function destroy(Reserva $reserva)
    {
        if ($reserva->user_id !== Auth::id()) {
            abort(403);
        }

        $reserva->delete();

        return redirect()->back()->with('success', 'Reserva eliminada del carrito.');
    }
}