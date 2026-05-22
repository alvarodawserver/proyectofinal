<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FacturaController extends Controller
{
    public function descargar(Reserva $reserva)
    {
        if ($reserva->user_id !== Auth::id() && !Auth::user()->hasRole('admin') && Auth::user()->role !== 'admin') {
            abort(403, 'No tienes permiso para ver esta factura.');
        }

        $reserva->load(['user', 'habitaciones.tipo', 'habitaciones.hotele']);

        $hotel = $reserva->habitaciones->first()->hotele ?? null;

        $pdf = Pdf::loadView('pdf.factura', [
            'reserva' => $reserva,
            'hotel' => $hotel,
        ]);

        return $pdf->stream("factura-reserva-{$reserva->id}.pdf");
    }
}