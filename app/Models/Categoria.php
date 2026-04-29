<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Categoria extends Model
{
    protected $fillable = ['nombre'];

    public function hoteles(): BelongsToMany
    {
        return $this->belongsToMany(Hotele::class, 'categoria_hotel', 'categoria_id', 'hotele_id')
                    ->withTimestamps(); // Si tu pivote tiene created_at y updated_at
    }
}
