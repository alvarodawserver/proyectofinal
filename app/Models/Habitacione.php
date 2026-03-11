<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Habitacione extends Model
{
    protected $fillable = ['num_habitacion'];
    public function reservas(){
        return $this->hasMany(Reserva::class);
    }

    public function tipo(){
        return $this->belongsTo(Tipo::class);
    }
}
