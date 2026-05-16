<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SolicitudPropietarioMail extends Mailable
{
    use Queueable, SerializesModels;

    public $datos; // Aquí guardaremos el nombre, email, mensaje, etc.

    public function __construct($datos)
    {
        $this->datos = $datos;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nueva Solicitud de Alta de Propietario',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.solicitud_propietario', // Crearemos esta vista ahora
        );
    }
}