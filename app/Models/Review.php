<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $table = 'reviews';
    protected $fillable = [
        'reserva_id',
        'valoracion',
        'comentario',
        'user_id',
        'hotele_id',
    ];

    public function reserva()
    {
        return $this->belongsTo(Reserva::class, 'reserva_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
