<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\Refund;
use Illuminate\Support\Facades\Auth;
use App\Models\Reserva;
use Illuminate\Support\Carbon;

class PagoController extends Controller
{
    /**
     * Inicia el proceso de pago con Stripe
     */
    public function checkout()
    {
        $user = Auth::user();
        $reservas = Reserva::with('habitaciones')->where('user_id', $user->id)
            ->where('estado', 'pendiente')
            ->get();

        if ($reservas->isEmpty()) return back()->with('error', 'Carrito vacío');

        // VALIDACIÓN DE DISPONIBILIDAD: Antes de ir a Stripe, comprobamos que nadie haya pagado ya
        if (!$this->verificarDisponibilidad($reservas)) {
            return back()->with('error', 'Lo sentimos, una de las habitaciones ya no está disponible para esas fechas.');
        }

        $total = $reservas->sum('precio_total');

        Stripe::setApiKey(config('services.stripe.secret'));

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => 'Reserva en Refugio del Mar',
                    ],
                    'unit_amount' => $total * 100, // Stripe usa céntimos
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => route('pago.exito') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('reservas.carrito'),
        ]);

        return inertia('Reservas/Pagos/redirigiendo', ['url' => $session->url]);
    }

    /**
     * Procesa el regreso exitoso de Stripe
     */
    public function exito(Request $request)
    {
        $sessionId = $request->input('session_id');
        if (!$sessionId) return redirect()->route('reservas.carrito');

        Stripe::setApiKey(config('services.stripe.secret'));
        $session = Session::retrieve($sessionId);
        $paymentIntentId = $session->payment_intent;

        $reservas = Reserva::where('user_id', auth()->id())
            ->where('estado', 'pendiente')
            ->get();

        foreach ($reservas as $reserva) {
            $reserva->update([
                'estado' => 'pagada',
                'stripe_id' => $paymentIntentId, // Guardamos el ID para futuras devoluciones
            ]);
        }

        return inertia('Reservas/Pagos/exito', [
            'mensaje' => '¡Reserva confirmada y pago registrado!',
            'total' => $reservas->sum('precio_total'),
        ]);
    }

    /**
     * FUNCIÓN ÚNICA DE CANCELACIÓN Y REEMBOLSO
     * Esta es la que debes llamar desde tu botón en el frontend
     */
    public function cancelarReserva($id)
{
    
    $reserva = Reserva::findOrFail($id);

    if ($reserva->estado !== 'pagada' || !$reserva->stripe_id) {
         return redirect()->route('reservas.index')->with('error', 'No se puede cancelar.');
    }

    $hoy = Carbon::now();
    $entrada = Carbon::parse($reserva->fecha_entrada);
    $diasDeAntelacion = $hoy->diffInDays($entrada, false);

    if ($diasDeAntelacion < 0) {
        return redirect()->route('reservas.index')->with('error', 'La reserva ya ha comenzado.');
    }

    $montoADevolver = $this->calcularMontoAReembolsar($reserva->precio_total, $diasDeAntelacion);

    try {
        Stripe::setApiKey(config('services.stripe.secret'));

        $amountCents = (int) round($montoADevolver * 100);

        if ($amountCents <= 0) {
            return redirect()->route('reservas.index')->with('error', 'Error en el cálculo del reembolso.');
        }


        Refund::create([
            'payment_intent' => $reserva->stripe_id,
            'amount' => $amountCents,
        ]);

        $reserva->estado = 'cancelada';
        $reserva->monto_reembolsado = $montoADevolver;
        $reserva->save();

        return redirect()->route('reservas.index')->with('success', 'Reserva cancelada y reembolso emitido.');

    } catch (\Exception $e) {
        return redirect()->route('reservas.index')->with('error', 'Error Stripe: ' . $e->getMessage());
    }
}

    /**
     * Lógica privada para verificar si las habitaciones están libres
     */
    private function verificarDisponibilidad($reservas)
    {
        foreach ($reservas as $reserva) {
            $fechaEntrada = $reserva->fecha_entrada;
            $fechaSalida = $reserva->fecha_salida;
            $habitacionesIds = $reserva->habitaciones->pluck('id');

            $solapada = Reserva::where('estado', 'pagada')
                ->whereHas('habitaciones', function ($query) use ($habitacionesIds) {
                    $query->whereIn('habitaciones.id', $habitacionesIds);
                })
                ->where(function ($query) use ($fechaEntrada, $fechaSalida) {
                    $query->where('fecha_entrada', '<', $fechaSalida)
                        ->where('fecha_salida', '>', $fechaEntrada);
                })
                ->exists();

            if ($solapada) return false;
        }
        return true;
    }

    /**
     * Lógica privada para calcular el % de devolución
     */
    private function calcularMontoAReembolsar($total, $dias)
    {
        if ($dias >= 15) return $total * 1.0;  
        if ($dias >= 7)  return $total * 0.75; 
        if ($dias >= 2)  return $total * 0.50;
        return $total * 0.10;                 
    }
}