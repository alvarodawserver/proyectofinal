<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    protected $table = 'reservas';
    protected $fillable = [
        'user_id',
        'oferta_id',
        'estado',
        'fecha_entrada',
        'fecha_salida',
        'precio_total',
        'stripe_id',
        'monto_reembolsado',
    ];
    public function habitaciones(){
        return $this->belongsToMany(Habitacione::class,'habitacione_reserva','reserva_id','habitacione_id');
    }

    public function oferta()
    {
        return $this->belongsTo(Oferta::class, 'oferta_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
