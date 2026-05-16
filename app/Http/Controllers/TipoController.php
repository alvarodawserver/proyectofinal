<?php

namespace App\Http\Controllers;

use App\Models\Habitacione;
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
        'nombre_tipo' => 'required|string',
        'precio' => 'required|numeric',
        'capacidad' => 'required|integer',
        'hotele_id' => 'required|exists:hoteles,id',
        // Validación de los campos de masa
        'generar_habitaciones' => 'boolean',
        'cantidad' => 'nullable|integer|min:1|max:100', // Ponemos un límite por seguridad
        'numero_inicio' => 'nullable|integer',
    ]);

    // 1. Creamos el Tipo de Habitación
    $tipo = Tipo::create([
        'nombre_tipo' => $validated['nombre_tipo'],
        'precio' => $validated['precio'],
        'capacidad' => $validated['capacidad'],
        'hotele_id' => $validated['hotele_id'],
    ]);


    if ($request->generar_habitaciones && $request->cantidad > 0) {
        $habitaciones = [];
        $numeroActual = $request->numero_inicio;

        for ($i = 0; $i < $request->cantidad; $i++) {
            $habitaciones[] = [
                'tipo_habitacion_id' => $tipo->id,
                'numero_habitacion' => $numeroActual,
                'estado' => 'disponible',
                'created_at' => now(),
                'updated_at' => now(),
            ];
            $numeroActual++; 
        }

        Habitacione::insert($habitaciones);
    }

    return redirect()->route('tipos.index')->with('success', 'Tipo de habitación y su inventario creados con éxito.');
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
