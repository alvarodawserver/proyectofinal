<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    protected $table = 'reservas';
    protected $fillable = [
        'habitacione_id',
        'user_id',
        'oferta_id',
        'estado',
        'fecha_entrada',
        'fecha_salida',
        'precio_total'
    ];
    public function habitacione(){
        return $this->belongsTo(Habitacione::class);
    }
}
