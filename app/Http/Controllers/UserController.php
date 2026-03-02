<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $habitacione)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $habitacione)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $habitacione)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $habitacione)
    {
        //
    }

    public function hacerReserva(Request $request){
        $request->validate([
        'habitacione_id' => 'required|exists:habitaciones,id',
        'fecha_entrada' => 'required|date',
        'fecha_salida'  => 'required|date|after:fecha_entrada',
        'oferta_id'     => 'nullable|exists:ofertas,id', // Es opcional
    ]);
    }
}
