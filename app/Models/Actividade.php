<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Actividade extends Model
{
    protected $table = 'activities';
    protected $fillable = [
        'hotele_id',
        'nombre_actividad',
        'descripcion',
        'precio',
        'fecha_inicio',
        'fecha_fin',
        'capacidad',
    ];

    /**
     * Relación: Una actividad pertenece a un hotel.
     */
    public function hoteles()
    {
        // activity_hotel es el nombre de la tabla pivote
        return $this->belongsToMany(Hotele::class, 'activity_hotel', 'activity_id', 'hotel_id');
    }
}
