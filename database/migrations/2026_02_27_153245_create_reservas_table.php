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
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('habitacione_id')->constrained('habitaciones');
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('oferta_id')->nullable()->constrained('ofertas');
            $table->string('estado');
            $table->date('fecha_entrada');
            $table->date('fecha_salida');
            $table->decimal('precio_total',8,2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservas');
    }
};
