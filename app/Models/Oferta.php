<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Oferta extends Model
{
    protected $table = 'ofertas';

    protected $fillable = [
        'hotel_id',
        'nombre',
        'descuento_porcentaje',
        'fecha_inicio',
        'fecha_fin',
        'activa'
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotele::class, 'hotel_id');
    }
}
