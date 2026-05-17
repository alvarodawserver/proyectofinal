<?php

namespace App\Http\Controllers;

use App\Models\Habitacione;
use App\Models\Reserva;
use App\Models\Oferta;
use App\Mail\SolicitudReembolsoMail;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ReservaController extends Controller
{
    public function index()
    {
        $reservas = Reserva::with(['habitaciones.hotele', 'habitaciones.tipo'])
            ->where('user_id', auth()->id())
            ->whereIn('estado', ['pagada', 'cancelada', 'reembolso_pendiente'])
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

    /**
     * Gestiona la solicitud de cancelación calculando el reembolso manual 
     * en base a las políticas del hotel y enviando una alerta por email.
     */
    public function solicitarCancelacion(Reserva $reserva)
    {
        if ($reserva->user_id !== Auth::id()) {
            abort(403);
        }

        if ($reserva->estado !== 'pagada') {
            return back()->with('error', 'Solo se pueden cancelar reservas que ya estén pagadas.');
        }

        // Recuperamos el hotel asociado a través de la relación de su primera habitación
        $primeraHabitacion = $reserva->habitaciones()->with('hotele')->first();
        
        if (!$primeraHabitacion || !$primeraHabitacion->hotele) {
            return back()->with('error', 'No se ha podido localizar el hotel asociado a esta reserva.');
        }

        $hotel = $primeraHabitacion->hotele;

        // Calculamos la antelación (días enteros) entre el momento actual y el día del check-in
        $hoy = Carbon::now()->startOfDay();
        $fechaEntrada = Carbon::parse($reserva->fecha_entrada)->startOfDay();
        $diasAntelacion = $hoy->diffInDays($fechaEntrada, false);

        $porcentajeReembolso = 0;

        // Si cancela antes del día de entrada, cruzamos los datos con su JSON de política
        if ($diasAntelacion > 0) {
            // Si el hotel no tiene política guardada, usamos un fallback estándar por seguridad
            $politicas = collect($hotel->politica_cancelacion ?? [
                ['dias_antes' => 7, 'porcentaje' => 100],
                ['dias_antes' => 3, 'porcentaje' => 50]
            ])->sortByDesc('dias_antes');

            foreach ($politicas as $politica) {
                if ($diasAntelacion >= $politica['dias_antes']) {
                    $porcentajeReembolso = $politica['porcentaje'];
                    break;
                }
            }
        }


        $montoReembolso = ($reserva->precio_total * $porcentajeReembolso) / 100;

        // Ponemos la reserva en espera de que el administrador ejecute el retorno en Stripe
        $reserva->update([
            'estado' => 'reembolso_pendiente'
        ]);

        Mail::to('alvaro.vidal@iesdonana.org')->send(
            new SolicitudReembolsoMail($reserva, $montoReembolso, $diasAntelacion)
        );

        return redirect()->back()->with('success', 'Tu solicitud de cancelación se ha procesado. Recibirás tu reembolso en tu tarjeta de acuerdo con la política del hotel.');
    }
}