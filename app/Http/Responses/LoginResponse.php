<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Inertia\Inertia; 

class LoginResponse implements LoginResponseContract
{
    /**
     * @param  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        $user = $request->user();

       
        if ($user->hasRole('admin')) {
            session()->flash('success', '¡Bienvenido al panel, Administrador!');
            return Inertia::location('/dashboard');
        }

       
        if ($user->hasRole('propietario')) {
            session()->flash('success', '¡Bienvenido de nuevo a tu gestión!');
            return Inertia::location('/hoteles');
        }

       
        session()->flash('success', '¡Sesión iniciada con éxito! Bienvenido, ' . $user->name);
        return Inertia::location('/');
    }
}