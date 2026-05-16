@component('mail::message')
# Nueva solicitud de alta

Has recibido una nueva petición para registrar un hotel en la plataforma.

**Datos del solicitante:**
- **Nombre:** {{ $datos['nombre'] }}
- **Email:** {{ $datos['email'] }}
- **Nombre del Hotel:** {{ $datos['nombre_hotel'] }}

**Mensaje/Comentarios:**
{{ $datos['mensaje'] }}

@component('mail::button', ['url' => config('app.url') . '/usuarios'])
Ir al Panel de Administración
@endcomponent

Gracias,<br>
{{ config('app.name') }}
@endcomponent