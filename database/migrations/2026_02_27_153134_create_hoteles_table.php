<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hoteles', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_hotel');
            $table->foreignId('propietario_id')->constrained('users');
            $table->text('descripcion');
            $table->string('direccion');
            $table->string('ciudad');
            $table->string('categoria');
            $table->decimal('latitud',10,8);
            $table->decimal('longitud',11,8);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hoteles');
    }
};
