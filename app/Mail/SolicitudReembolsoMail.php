<?php

namespace App\Mail;

use App\Models\Reserva;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SolicitudReembolsoMail extends Mailable
{
    use Queueable, SerializesModels;

    public $reserva;
    public $montoReembolso;
    public $diasAntelacion;

    public function __construct($reserva, $montoReembolso, $diasAntelacion)
    {
        $this->reserva = $reserva;
        $this->montoReembolso = $montoReembolso;
        $this->diasAntelacion = $diasAntelacion;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '⚠️ Alerta: Solicitud de Reembolso Manual (Reserva #' . $this->reserva->id . ')',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.solicitud-reembolso', // Crearemos esta vista ahora
        );
    }
}