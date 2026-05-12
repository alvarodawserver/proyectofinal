<?php

use App\Http\Controllers\ActividadeController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\HoteleController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\OfertaController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\TipoController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', [MainController::class, 'index'])->name('home');

Route::get('/hoteles/{hotel}/show', [HoteleController::class, 'show'])->name('hoteles.show');

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('hoteles',HoteleController::class)->except(['show']);
    
    Route::resource('tipos',TipoController::class);
    Route::resource('actividades',ActividadeController::class);
    Route::resource('categorias',CategoriaController::class);
    Route::resource('ofertas',OfertaController::class);
    Route::patch('ofertas/{oferta}/toggle', [OfertaController::class, 'toggle'])->name('ofertas.toggle');
    Route::resource('usuarios', UserController::class);
    Route::post('/usuarios/store', [UserController::class, 'store'])->name('usuarios.store');
    Route::delete('/usuarios/{user}', [UserController::class, 'destroy'])->name('usuarios.destroy');

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->middleware(['auth', 'verified'])->name('dashboard');
    
       
    
});
Route::middleware(['auth'])->group(function () {
    Route::post('/reservas', [ReservaController::class, 'store'])->name('reservas.store');
    Route::get('/carrito', [ReservaController::class, 'getCart'])->name('reservas.carrito');
    Route::post('/reservas/cancelar/{id}', [PagoController::class, 'cancelarReserva'])->name('reservas.cancelar');
    
    Route::delete('/reservas/{reserva}', [ReservaController::class, 'destroy'])->name('reservas.destroy');


    Route::post('/pago', [PagoController::class, 'checkout'])->name('pago.checkout');
    Route::get('/pago/exito', [PagoController::class, 'exito'])->name('pago.exito');
    Route::get('/pago/cancelado', function() {
        return redirect()->route('reservas.carrito')->with('error', 'El pago fue cancelado.');
    })->name('pago.cancelado');
    Route::get('/mis-reservas', [ReservaController::class, 'index'])->name('reservas.index');
});
Route::get('/busqueda', [SearchController::class, 'busqueda'])->name('busqueda');
Route::get('/api/sugerencias', [SearchController::class, 'sugerencias'])->name('api.sugerencias');



require __DIR__.'/settings.php';
