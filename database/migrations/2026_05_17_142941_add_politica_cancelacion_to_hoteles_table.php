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
        Schema::table('hoteles', function (Blueprint $table) {
            $table->json('politica_cancelacion')->nullable()->default(json_encode([
                ['dias_antes' => 7, 'porcentaje' => 100],
                ['dias_antes' => 3, 'porcentaje' => 50]
            ]));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hoteles', function (Blueprint $table) {
            $table->dropColumn('politica_cancelacion');
        });
    }
};
