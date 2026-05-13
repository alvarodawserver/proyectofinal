<?php

namespace App\Http\Controllers;

use App\Models\Actividade;
use App\Models\Hotele; // Asegúrate de que el modelo se llame así
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActividadeController extends Controller
{
    /**
     * Muestra el listado y el formulario (Todo en uno)
     */
    public function index()
    {
        return Inertia::render('Actividades/index', [
            'activities' => Actividade::with('hoteles')->latest()->get(),

            'hoteles' => Hotele::all(['id', 'nombre_hotel'])
        ]);
    }

    /**
     * Guarda una nueva actividad y la vincula a los hoteles
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre_actividad' => 'required|string|max:255',
            'descripcion'      => 'required|string',
            'precio'           => 'required|numeric|min:0',
            'capacidad'        => 'required|integer|min:1',
            'hoteles_ids'      => 'required|array|min:1', // Al menos un hotel seleccionado
            'hoteles_ids.*'    => 'exists:hoteles,id',
        ]);

        // 1. Crear la actividad
        $actividad = Actividade::create([
            'nombre_actividad' => $validated['nombre_actividad'],
            'descripcion'      => $validated['descripcion'],
            'precio'           => $validated['precio'],
            'capacidad'        => $validated['capacidad'],
        ]);

        // 2. Vincular con los hoteles en la tabla pivote
        $actividad->hoteles()->attach($validated['hoteles_ids']);

        return redirect()->back()->with('message', 'Actividad creada con éxito');
    }

    /**
     * Elimina la actividad (la tabla pivote se limpia sola por el onDelete cascade)
     */
    public function destroy($id)
    {
        $actividad = Actividade::findOrFail($id);
        $actividad->delete();

        return redirect()->back()->with('message', 'Actividad eliminada');
    }

    /**
     * Opcional: Si decides hacer un update rápido
     */
    public function update(Request $request, $id)
    {
        $actividad = Actividade::findOrFail($id);
        
        $validated = $request->validate([
            'nombre_actividad' => 'required|string|max:255',
            'descripcion'      => 'required|string',
            'precio'           => 'required|numeric',
            'capacidad'        => 'required|integer',
            'hoteles_ids'      => 'required|array',
        ]);

        $actividad->update($validated);
        
        // sync() elimina las relaciones antiguas y pone solo las nuevas
        $actividad->hoteles()->sync($validated['hoteles_ids']);

        return redirect()->back();
    }
}