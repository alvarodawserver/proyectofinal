<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Hotele;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function busqueda(Request $request)
{
    $categorias = Categoria::all();


    $query = Hotele::query()->with(['images', 'servicios']);


    $query->when($request->lugar, function ($q) use ($request) {
        $q->where('ciudad', 'ilike', "%{$request->lugar}%");
    });

    $query->when($request->personas, function ($q) use ($request) {
        $q->whereHas('habitaciones', function ($h) use ($request) {
            $h->whereHas('tipo', function ($t) use ($request) {
                $t->where('capacidad', '>=', $request->personas);
            });
        });
    });

    $query->when($request->categoria_id, function ($q) use ($request) {
        $q->whereHas('categorias', function ($c) use ($request) {
            $c->where('id', $request->categoria_id);
        });
    });

 
    $query->when($request->entrada && $request->salida, function ($q) use ($request) {
        $q->whereDoesntHave('reservas', function ($sub) use ($request) {
            $sub->where('fecha_inicio', '<', $request->salida)
                ->where('fecha_fin', '>', $request->entrada);
        });
    });

    return Inertia::render('Hoteles/Resultados/resultados', [
        'hoteles' => $query->get(),
        'filtros' => $request->all(),
        'categorias' => $categorias,
    ]);
    }
}
