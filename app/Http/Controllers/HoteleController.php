<?php

namespace App\Http\Controllers;

use App\Models\Habitacione;
use App\Models\Hotele;
use App\Models\Oferta;
use App\Models\Reserva;
use App\Models\Review;
use App\Models\Servicio;
use App\Models\Tipo;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HoteleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       $user = Auth::user();
        
        if ($user->hasRole('admin') || $user->role === 'admin') {
            $hoteles = Hotele::withCount('habitaciones')->get();
        } else {
            $hoteles = Hotele::where('propietario_id', $user->id)
                             ->withCount('habitaciones')
                             ->get();
        }
        
        return Inertia::render('Hoteles/Admin/index', [
            'hoteles' => $hoteles
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Hoteles/Admin/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre_hotel' => 'required|string|max:255',
            'propietario_id' => 'nullable|exists:users,id',
            'direccion' => 'required|string|max:255',
            'ciudad' => 'required|string|max:255',
            'latitud' => 'required|numeric',
            'longitud' => 'required|numeric',
            'descripcion' => 'nullable|string',
        ]);

        Hotele::create([
            'propietario_id' => Auth::user()->id,
            'estado' => 'oculto',
            'politica_cancelacion' => json_encode([
                ['dias_antes' => 7, 'porcentaje' => 100],
                ['dias_antes' => 3, 'porcentaje' => 50]
            ]),
            ...$validated
        ]);
        return redirect()->back()->with('success', 'Hotel creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Hotele $hotel)
    {
        $hotel = Hotele::with(['images', 'servicios', 'habitaciones.tipo'])->findOrFail($hotel->id);
        
        $ratingCount = $hotel->reviews()->count();
        $ratingAverage = $hotel->reviews()->avg('valoracion') ?? 0;
        
        $allReviews = $hotel->reviews()
            ->with('user:id,name,profile_photo_url')
            ->latest()
            ->get();

        $reviewDestacada = $allReviews->where('valoracion', '>=', 4)->first();

        $reservaParaOpinar = null;
        if (Auth::check()) {
            $reservaParaOpinar = Reserva::where('user_id', Auth::id())
                ->whereHas('habitaciones', function($q) use ($hotel) {
                    $q->where('hotele_id', $hotel->id);
                })
                ->where('estado', 'pagada')
                ->whereDoesntHave('review') 
                ->first();
        }

        $ofertaAplicada = null;
        if ($request->has('oferta_id')) {
            $ofertaAplicada = Oferta::where('id', $request->oferta_id)
                ->where('hotel_id', $hotel->id)
                ->where('activa', true)
                ->where('fecha_inicio', '<=', now())
                ->where('fecha_fin', '>=', now())
                ->first();
        }

        // 4. Retornamos los datos a Inertia (Aplicado filtro de codificación a servicios)
        return Inertia::render('Hoteles/show', [
            'hotel' => $hotel,
            'oferta_aplicada' => $ofertaAplicada,
            'rating' => [
                'average' => round($ratingAverage, 1),
                'count' => $ratingCount,
                'description' => $this->getRatingDescription($ratingAverage),
            ],
            'review_destacada' => $reviewDestacada,
            'all_reviews' => $allReviews,
            'eligida_reserva_id' => $reservaParaOpinar ? $reservaParaOpinar->id : null,
            'images' => $hotel->images->map(fn($img) => asset('storage/' . $img->path)),
            'servicios' => $hotel->servicios->map(fn($srv) => [
                'id' => $srv->id,
                'nombre' => mb_check_encoding($srv->nombre_servicio, 'UTF-8')
                    ? $srv->nombre_servicio
                    : mb_convert_encoding($srv->nombre_servicio, 'UTF-8', 'ISO-8859-1'),
                'icono' => $srv->icono, 
            ])
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Hotele $hotele)
    {
        $propietarios = User::role('propietario')->get(['id', 'name']);
        
        // APLICADO: Filtro de codificación para el listado general de servicios
        $servicios = Servicio::all(['id', 'nombre_servicio'])->map(function ($servicio) {
            return [
                'id' => $servicio->id,
                'nombre_servicio' => mb_check_encoding($servicio->nombre_servicio, 'UTF-8')
                    ? $servicio->nombre_servicio
                    : mb_convert_encoding($servicio->nombre_servicio, 'UTF-8', 'ISO-8859-1'),
            ];
        });

        $hotele->load('servicios'); 
        
        // APLICADO: Por si en la vista de Vue/Inertia usas también los nombres del hotel cargado
        $hotele->servicios->transform(function ($srv) {
            $srv->nombre_servicio = mb_check_encoding($srv->nombre_servicio, 'UTF-8')
                ? $srv->nombre_servicio
                : mb_convert_encoding($srv->nombre_servicio, 'UTF-8', 'ISO-8859-1');
            return $srv;
        });

        $hotele->servicios_ids = $hotele->servicios->pluck('id');
        $tiposHabitacion = Tipo::withCount(['habitaciones' => function ($query) use ($hotele) {
            $query->where('hotele_id', $hotele->id);
        }])->get(['id', 'tipo_habitacion', 'precio']);
        
        $hotele->imagen_url = $hotele->imagen_principal 
            ? asset('storage/' . $hotele->imagen_principal) 
            : null;

        return Inertia::render('Hoteles/Admin/edit', [
            'hotel' => $hotele,
            'propietarios' => $propietarios,
            'servicios' => $servicios,
            'tipos_habitacion' => $tiposHabitacion
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Hotele $hotele)
    {
        $validated = $request->validate([
            'nombre_hotel' => 'required|string|max:255',
            'propietario_id' => 'nullable|exists:users,id',
            'direccion' => 'required|string|max:255',
            'politica_cancelacion' => 'required|array',
            'politica_cancelacion.*.dias_antes' => 'required|integer|min:0',
            'politica_cancelacion.*.porcentaje' => 'required|integer|min:0|max:100',
            'estado' => 'required|string|max:255',
            'ciudad' => 'required|string|max:255',
            'latitud' => 'required|numeric',
            'longitud' => 'required|numeric',
            'descripcion' => 'nullable|string',
            'imagen_principal' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'imagenes_adicionales' => 'nullable|array',
            'imagenes_adicionales.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            'imagenes_eliminadas' => 'nullable|array',
            'imagenes_eliminadas.*' => 'integer|exists:images,id', 
            'servicios' => 'nullable|array',
            'servicios.*' => 'exists:servicios,id', 
        ]);


        if ($request->hasFile('imagen_principal')) {
            $oldPrimary = $hotele->images()->where('is_primary', true)->first();
            if ($oldPrimary) {
                Storage::disk('public')->delete($oldPrimary->path); 
                $oldPrimary->delete();
            }

            $path = $request->file('imagen_principal')->store('hoteles', 'public');
            
            $hotele->images()->create([
                'path' => $path,
                'is_primary' => true
            ]);
        }

        if ($request->filled('imagenes_eliminadas')) {
            $imagenesParaBorrar = $hotele->images()->whereIn('id', $request->input('imagenes_eliminadas'))->get();
            foreach ($imagenesParaBorrar as $img) {
                Storage::disk('public')->delete($img->path); // Borra el archivo físico
                $img->delete(); // Borra el registro en BD
            }
        }

        if ($request->hasFile('imagenes_adicionales')) {
            foreach ($request->file('imagenes_adicionales') as $file) {
                $path = $file->store('hoteles', 'public');
                
                $hotele->images()->create([
                    'path' => $path,
                    'is_primary' => false
                ]);
            }
        }

        $hotele->update($validated);
        $hotele->servicios()->sync($request->input('servicios', []));

        return redirect()->route('hoteles.index')->with('success', 'Hotel actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hotele $hotele)
    {
        $hotele->delete();
        return redirect()->route('hoteles.index')->with('success', 'Hotel eliminado exitosamente.');
    }

    public function generarHabitacionesMasa(Request $request)
    {
        // Validación de rol
        if (!auth()->user()->hasRole('admin') && auth()->user()->role !== 'admin') {
            abort(403, 'No autorizado.');
        }

        $validated = $request->validate([
            'hotele_id'       => 'required|exists:hoteles,id', 
            'tipo_habitacion' => 'required|exists:tipos,id',   
            'cantidad'        => 'required|integer|min:1|max:150',
            'numero_inicio'   => 'required|integer|min:1',
        ]);

        $habitaciones = [];
        $numeroActual = $validated['numero_inicio'];

        for ($i = 0; $i < $validated['cantidad']; $i++) {
            $habitaciones[] = [
                'num_habitacion'  => $numeroActual,                 
                'tipo_habitacion' => $validated['tipo_habitacion'], 
                'hotele_id'       => $validated['hotele_id'],    
                'created_at'      => now(),
                'updated_at'      => now(),
            ];
            $numeroActual++;
        }

        Habitacione::insert($habitaciones);

        return redirect()->back()->with('success', "Se han generado {$validated['cantidad']} habitaciones correctamente.");
    }

    private function getRatingDescription(float $average): string
    {
        if ($average === 0.0) {
            return 'Sin puntuación';
        }
        
        // Rangos basados en una escala del 1 al 5
        return match (true) {
            $average >= 4.7 => 'Excepcional',
            $average >= 4.5 => 'Magnífico',
            $average >= 4.2 => 'Fantástico',
            $average >= 3.8 => 'Muy bien',
            $average >= 3.5 => 'Bien',
            $average >= 3.0 => 'Aceptable',
            default         => 'Mejorable',
        };
    }

    public function storeReview(Request $request, Hotele $hotel)
    {
        // 1. Validamos los datos mínimos que entran del formulario
        $request->validate([
            'reserva_id' => 'required|exists:reservas,id',
            'valoracion' => 'required|integer|min:1|max:5',
            'comentario' => 'required|string|min:5|max:1000', 
        ]);

        $reservaValida = Reserva::where('id', $request->reserva_id)
            ->where('user_id', Auth::id())
            ->where('estado', 'pagada')
            ->whereHas('habitaciones', function($query) use ($hotel) {
                $query->where('hotele_id', $hotel->id);
            })
            ->whereDoesntHave('review') // Relación en tu modelo Reserva (hasOne Review)
            ->first();

        if (!$reservaValida) {
            return redirect()->back()->withErrors([
                'comentario' => 'No tienes autorización para dejar una reseña sobre este alojamiento o ya has valorado esta estancia.'
            ]);
        }
        
        Review::create([
            'reserva_id' => $reservaValida->id,
            'hotele_id'   => $hotel->id,
            'user_id'    => Auth::user()->id,
            'valoracion' => $request->valoracion,
            'comentario' => $request->comentario,
        ]);

        return redirect()->back()->with('success', '¡Tu opinión ha sido publicada con éxito!');
    }
}