<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Habitacione;
use App\Models\Hotele;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SearchController extends Controller
{
  public function busqueda(Request $request)
{
    $categorias = Categoria::all()->map(function($cat) {
        return [
            'id' => $cat->id,
            'nombre' => mb_check_encoding($cat->nombre, 'UTF-8') 
                        ? $cat->nombre 
                        : mb_convert_encoding($cat->nombre, 'UTF-8', 'ISO-8859-1'),
        ];
    });

    // 1. CARGAMOS LAS OFERTAS DINÁMICAMENTE
    // Usamos una función anónima en el 'with' para que Laravel solo traiga
    // las ofertas que están activas HOY. Así, si vence, desaparece sola de la vista.
    $query = Hotele::query()->with([
        'images', 
        'servicios', 
        'categorias',
        'ofertas' => function($q) {
            $q->where('activa', true)
              ->where('fecha_inicio', '<=', now())
              ->where('fecha_fin', '>=', now());
        }
    ])
    ->addSelect(['precio_min' => Habitacione::selectRaw('
            MIN(tipos.precio_base) * (1 - COALESCE(
                (SELECT descuento_porcentaje FROM ofertas 
                 WHERE ofertas.hotel_id = hoteles.id 
                 AND activa = true 
                 AND fecha_inicio <= NOW() 
                 AND fecha_fin >= NOW() 
                 LIMIT 1), 0) / 100)
        ')
        ->join('tipos', 'habitaciones.tipo_habitacion', '=', 'tipos.id')
        ->whereColumn('habitaciones.hotele_id', 'hoteles.id')
    ]);

    $query->when($request->lugar, function ($q) use ($request) {
        $lugar = $request->lugar;
        if (str_contains($lugar, ' - ')) {
            [$ciudad, $hotel] = explode(' - ', $lugar, 2);
            $q->where(function($sub) use ($ciudad, $hotel) {
                $sub->where('ciudad', 'ilike', "%{$ciudad}%")
                    ->where('nombre_hotel', 'ilike', "%{$hotel}%");
            });
        } else {
            $q->where(function($sub) use ($lugar) {
                $sub->where('nombre_hotel', 'ilike', "%{$lugar}%")
                    ->orWhere('ciudad', 'ilike', "%{$lugar}%");
            });
        }
    });


    $query->when($request->personas, function ($q) use ($request) {
        $q->whereHas('habitaciones.tipo', function ($t) use ($request) {
            $t->where('capacidad', '>=', $request->personas);
        });
    });

    $query->when($request->categoria_id, function ($q) use ($request) {
        $q->whereHas('categorias', function ($c) use ($request) {
            $c->where('categorias.id', $request->categoria_id); 
        });
    });


    $query->when($request->precio_max, function ($q) use ($request) {
        $q->whereHas('habitaciones.tipo', function ($t) use ($request) {
            $t->where('tipos.precio_base', '<=', $request->precio_max);
        });
    });

    $query->when($request->entrada && $request->salida, function ($q) use ($request) {
        $q->whereHas('habitaciones', function ($queryHabitacion) use ($request) {
            $queryHabitacion->whereDoesntHave('reservas', function ($queryReserva) use ($request) {
                $queryReserva->where(function ($sub) use ($request) {
                    $sub->where('fecha_inicio', '<', $request->salida)
                        ->where('fecha_fin', '>', $request->entrada);
                });
            });
        });
    });

    if ($request->order === 'precio_asc') {
        $query->orderBy('precio_min', 'asc');
    } elseif ($request->order === 'precio_desc') {
        $query->orderBy('precio_min', 'desc');
    } else {
        $query->latest();
    }

    return Inertia::render('Hoteles/Resultados/resultados', [
        'hoteles' => $query->get(),
        'filtros' => $request->all(),
        'categorias' => $categorias, 
    ]);
}

// app/Http/Controllers/SearchController.php

public function sugerencias(Request $request)
{
    $term = $request->input('q');

    if (!$term || strlen($term) < 1) {
        return response()->json([]);
    }

    // Buscamos hoteles que coincidan en nombre o ciudad
    $sugerencias = Hotele::where('nombre_hotel', 'ilike', "%{$term}%")
        ->orWhere('ciudad', 'ilike', "%{$term}%")
        ->limit(8)
        ->get()
        ->map(function($hotel) {
            return [
                'id' => $hotel->id,
                'label' => "{$hotel->ciudad} - {$hotel->nombre_hotel}", // El texto que verá el usuario
                'nombre' => $hotel->nombre_hotel,
                'ciudad' => $hotel->ciudad
            ];
        });

    return response()->json($sugerencias);
}


}
