<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Hotele extends Model
{
    protected $table = 'hoteles';

    protected $fillable = [
        'nombre_hotel',
        'propietario_id',
        'descripcion',
        'direccion',
        'ciudad',
        'categoria',
        'latitud',
        'longitud'
    ];

    protected $appends = ['rating', 'precio_min'];




    public function images() { return $this->hasMany(Image::class, 'hotele_id'); }
    public function habitaciones() { return $this->hasMany(Habitacione::class, 'hotele_id'); }
    
    public function servicios(): BelongsToMany
    {
        return $this->belongsToMany(Servicio::class, 'servicio_hotel', 'hotele_id', 'servicio_id')
                    ->withTimestamps(); // Si tu pivote tiene created_at y updated_at
    }
    public function reviews() 
    {
        // Esto es mucho más limpio. Laravel navegará Hotel -> Habitaciones -> Reservas -> Reviews
        return $this->hasManyThrough(Review::class, Reserva::class, 'habitacione_id', 'reserva_id', 'id', 'id')
                    ->join('habitaciones', 'reservas.habitacione_id', '=', 'habitaciones.id')
                    ->where('habitaciones.hotele_id', $this->id);
    }


    public function getRatingAttribute()
    {
        return $this->reviews()->avg('valoracion') ?? 0;
    }

    // 3. Definimos el calculador para el precio mínimo
    public function getPrecioMinAttribute()
    {
        return $this->habitaciones()
        ->join('tipos', 'habitaciones.tipo_habitacion', '=', 'tipos.id')
        ->min('tipos.precio_base') ?? 0;
    }


    public function reservas()
{
    return $this->hasManyThrough(
        Reserva::class, 
        Habitacione::class, 
        'hotele_id',       
        'habitacione_id',  
        'id',              
        'id'               
    );

}
    public function categorias(): BelongsToMany
    {
        return $this->belongsToMany(Categoria::class, 'categoria_hotel', 'hotele_id', 'categoria_id')
                    ->withTimestamps(); // Si tu pivote tiene created_at y updated_at
    }


    public function ofertas() {
    return $this->hasMany(Oferta::class, 'hotel_id');
    }


    public function ofertaActiva() {
        return $this->ofertas()
            ->where('activa', true)
            ->where('fecha_inicio', '<=', now())
            ->where('fecha_fin', '>=', now())
            ->first(); 
    }

}