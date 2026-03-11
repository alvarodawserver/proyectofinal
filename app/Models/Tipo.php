<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tipo extends Model
{
    
    public function habitaciones(){
        return $this->hasMany(Habitacione::class);
    }
}
