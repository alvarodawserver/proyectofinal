<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tipo extends Model
{
    
    protected $table = 'tipos';
    protected $fillable = [
        'tipo_habitacion',
        'capacidad',
        'precio_base',
        'cantidad_habitacion'
    ];
    public function habitaciones(){
        return $this->hasMany(Habitacione::class);
    }
}
