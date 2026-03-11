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
        Schema::create('images', function (Blueprint $table) {
            $table->id();
            $table->string('path'); // Aquí se guarda "hoteles/foto1.jpg"
            $table->foreignId('hotele_id')->constrained('hoteles')->onDelete('cascade');
            $table->boolean('is_primary')->default(false); // Para saber cuál es la foto de portada
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('images');
    }
};
