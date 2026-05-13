<?php

namespace App\Http\Controllers;

use App\Models\Tipo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TipoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    $tipos = Tipo::all();
    return Inertia::render('Tipos/index', [
        'tipos' => $tipos
    ]);
}

public function create()
{
    return Inertia::render('Tipos/create');
}

public function store(Request $request)
{
    $validated = $request->validate([
        'tipo_habitacion' => 'required|string|max:255',
        'capacidad' => 'required|integer|min:1',
        'precio_base' => 'required|numeric|min:0',
        'cantidad_habitacion' => 'required|integer|min:1',
    ]);

    Tipo::create($validated);

    return redirect()->route('tipos.index')->with('success', 'Tipo de habitación creado.');
}

public function edit(Tipo $tipo)
{
    return Inertia::render('Tipos/edit', [
        'tipo' => $tipo
    ]);
}

public function update(Request $request, Tipo $tipo)
{
    $validated = $request->validate([
        'tipo_habitacion' => 'required|string|max:255',
        'capacidad' => 'required|integer|min:1',
        'precio_base' => 'required|numeric|min:0',
        'cantidad_habitacion' => 'required|integer|min:1',
    ]);

    $tipo->update($validated);

    return redirect()->route('tipos.index')->with('success', 'Tipo de habitación actualizado.');
}

public function destroy(Tipo $tipo)
{
    $tipo->delete();
    return redirect()->back();
}
}
