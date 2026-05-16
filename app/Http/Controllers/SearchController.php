<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Habitacione;
use App\Models\Hotele;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function busqueda(Request $request)
    {
        $categorias = Categoria::all()->map(function ($cat) {
            return [
                'id' => $cat->id,
                'nombre' => mb_check_encoding($cat->nombre, 'UTF-8')
                    ? $cat->nombre
                    : mb_convert_encoding($cat->nombre, 'UTF-8', 'ISO-8859-1'),
            ];
        });

        // 1. Iniciamos la consulta con las relaciones necesarias y ofertas vigentes
        $query = Hotele::query()->with([
            'images',
            'servicios',
            'categorias',
            'ofertas' => function ($q) {
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
            ->where('estado', 'disponible')
            ->join('tipos', 'habitaciones.tipo_habitacion', '=', 'tipos.id')
            ->whereColumn('habitaciones.hotele_id', 'hoteles.id')
        ]);

        // 2. Filtro por lugar (Ciudad o Nombre de Hotel)
        $query->when($request->lugar, function ($q) use ($request) {
            $lugar = $request->lugar;
            if (str_contains($lugar, ' - ')) {
                [$ciudad, $hotel] = explode(' - ', $lugar, 2);
                $q->where(function ($sub) use ($ciudad, $hotel) {
                    $sub->where('ciudad', 'ilike', "%{$ciudad}%")
                        ->where('nombre_hotel', 'ilike', "%{$hotel}%");
                });
            } else {
                $q->where(function ($sub) use ($lugar) {
                    $sub->where('nombre_hotel', 'ilike', "%{$lugar}%")
                        ->orWhere('ciudad', 'ilike', "%{$lugar}%");
                });
            }
        });

        // 3. Filtro por Categoría
        $query->when($request->categoria_id, function ($q) use ($request) {
            $q->whereHas('categorias', function ($c) use ($request) {
                $c->where('categorias.id', $request->categoria_id);
            });
        });

        // 4. FILTRO CRÍTICO: Disponibilidad y Capacidad
        // Buscamos hoteles que tengan al menos una habitación que cumpla TODO
        $query->whereHas('habitaciones', function ($qHab) use ($request) {
            
            // Filtro de Capacidad (Personas)
            $qHab->when($request->personas, function ($q) use ($request) {
                $q->whereHas('tipo', function ($t) use ($request) {
                    $t->where('capacidad', '>=', $request->personas);
                });
            });

            // Filtro de Precio Máximo
            $qHab->when($request->precio_max, function ($q) use ($request) {
                $q->whereHas('tipo', function ($t) use ($request) {
                    $t->where('tipos.precio_base', '<=', $request->precio_max);
                });
            });

            // Filtro de Fechas (Disponibilidad Real)
            $qHab->when($request->entrada && $request->salida, function ($q) use ($request) {
                $q->whereDoesntHave('reservas', function ($qRes) use ($request) {
                    $qRes->where('estado', 'pagada') // Solo bloquean las pagadas
                         ->where(function ($sub) use ($request) {
                             // Cruce de fechas: entrada < salida_reserva Y salida > entrada_reserva
                             $sub->where('fecha_entrada', '<', $request->salida)
                                 ->where('fecha_salida', '>', $request->entrada);
                         });
                });
            });
        });

        // 5. Ordenación
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

    public function sugerencias(Request $request)
    {
        $term = $request->input('q');

        if (!$term || strlen($term) < 1) {
            return response()->json([]);
        }

        $sugerencias = Hotele::where('nombre_hotel', 'ilike', "%{$term}%")
            ->orWhere('ciudad', 'ilike', "%{$term}%")
            ->limit(8)
            ->get()
            ->map(function ($hotel) {
                return [
                    'id' => $hotel->id,
                    'label' => "{$hotel->ciudad} - {$hotel->nombre_hotel}",
                    'nombre' => $hotel->nombre_hotel,
                    'ciudad' => $hotel->ciudad
                ];
            });

        return response()->json($sugerencias);
    }
}