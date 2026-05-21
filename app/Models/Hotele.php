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
        'politica_cancelacion',
        'direccion',
        'estado',
        'ciudad',
        'categoria',
        'latitud',
        'longitud'
    ];

    protected $appends = ['rating', 'precio_min'];
    protected $casts = [
        'politica_cancelacion' => 'array',
    ];



    public function images() { return $this->hasMany(Image::class, 'hotele_id'); }
    public function habitaciones() { return $this->hasMany(Habitacione::class, 'hotele_id'); }
    
    public function servicios(): BelongsToMany
    {
        return $this->belongsToMany(Servicio::class, 'servicio_hotel', 'hotele_id', 'servicio_id')
                    ->withTimestamps(); 
    }
    public function reviews()
{
    return $this->hasMany(Review::class, 'hotele_id');
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

    public function actividades()
    {
        return $this->belongsToMany(Actividade::class, 'activity_hotel', 'hotel_id', 'activity_id');
    }

    public function imagenesGaleria() {
    return $this->hasMany(Image::class)->where('is_primary', false);
    }

    public function imagenPrincipal() {
        return $this->hasOne(Image::class)->where('is_primary', true);
    }

}