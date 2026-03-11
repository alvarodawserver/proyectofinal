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
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotele_id')->constrained('hoteles')->onDelete('cascade'); // Relación con el hotel
            $table->string('nombre_actividad');           // Nombre de la actividad (ej: Yoga, Buffet, Excursión)
            $table->text('descripcion');      // Breve descripción
            $table->decimal('precio', 8, 2)->default(0); // Precio (0 si es gratuita)
            $table->time('fecha_inicio')->nullable();
            $table->time('fecha_fin')->nullable();
            $table->integer('capacidad')->nullable(); // Límite de personas
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('actividades');
    }
};
