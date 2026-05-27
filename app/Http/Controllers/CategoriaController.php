<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Traemos todas las categorías ordenadas alfabéticamente
        $categorias = Categoria::orderBy('nombre', 'asc')->get();
        
        return Inertia::render('Categorias/index', [
            'categorias' => $categorias
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validamos que el nombre venga y sea único
        $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias,nombre'
        ]);

        Categoria::create([
            'nombre' => $request->nombre
        ]);

        return redirect()->back()->with('success', 'Categoría creada con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Categoria $categoria)
    {
        $categoria->delete();

        return redirect()->back()->with('success', 'Categoría eliminada.');
    }
}