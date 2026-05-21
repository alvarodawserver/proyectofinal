<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $table = 'images';
    protected $fillable = ['hotele_id', 'path', 'is_primary'];

    public function hotel()
    {
        return $this->belongsTo(Hotele::class, 'hotele_id');
    }
}
