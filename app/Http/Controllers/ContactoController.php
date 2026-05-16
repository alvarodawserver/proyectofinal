<?php

namespace App\Http\Controllers;

use App\Mail\SolicitudPropietarioMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactoController extends Controller
{
    public function enviarSolicitud(Request $request)
    {
        // 1. Validamos los datos que llegan desde el formulario React
        $data = $request->validate([
            'nombre'       => 'required|string|max:255',
            'email'        => 'required|email|max:255',
            'nombre_hotel' => 'required|string|max:255',
            'mensaje'      => 'required|string|min:10',
        ]);

        try {
            // 2. Enviamos el correo al administrador del sitio
            Mail::to('alvaro.vidal@iesdonana.org')->send(new SolicitudPropietarioMail($data));

            return back()->with('success', 'Tu solicitud ha sido enviada con éxito. Nos pondremos en contacto contigo pronto.');
            
        } catch (\Exception $e) {
            return back()->with('error', 'Hubo un problema al enviar el correo. Inténtalo de nuevo más tarde.');
        }
    }

    public function showForm()
    {
        return Inertia::render('Contacto/propietarioform'); 
    }
}