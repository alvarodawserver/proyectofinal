<?php

namespace App\Console\Commands;

use App\Models\Reserva;
use Illuminate\Console\Command;

class ProcesarReembolsos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:procesar-reembolsos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
{
        
    $reservas = Reserva::where('estado', 'reembolso_pendiente')->get();

    foreach ($reservas as $reserva) {
        $reserva->update(['estado' => 'reembolsado']);
    }

    $this->info('¡Reembolsos simulados procesados con éxito!');
}
}
