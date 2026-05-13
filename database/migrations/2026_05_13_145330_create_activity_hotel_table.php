<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {

        Schema::create('activity_hotel', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained('activities')->onDelete('cascade');
            $table->foreignId('hotel_id')->constrained('hoteles')->onDelete('cascade');
            $table->timestamps();
        });

        
        Schema::table('activities', function (Blueprint $table) {
            $table->dropForeign(['hotele_id']); 
            $table->dropColumn('hotele_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_hotel');
    }
};
