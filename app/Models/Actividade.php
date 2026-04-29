<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Actividade extends Model
{
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
    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotele::class, 'hotele_id');
    }
}
