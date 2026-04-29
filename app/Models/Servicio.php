<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Servicio extends Model
{
    protected $table = 'servicios';
    protected $fillable = [
        'nombre_servicio',
        'icono',
    ];

    public function hoteles(): BelongsToMany
    {
        return $this->belongsToMany(Hotele::class, 'servicio_hotel', 'servicio_id', 'hotele_id')
                    ->withTimestamps(); 
    }
}
