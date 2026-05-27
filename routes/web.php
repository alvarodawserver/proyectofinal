<?php

use App\Http\Controllers\ActividadeController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ContactoController;
use App\Http\Controllers\FacturaController;
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


Route::get('/', [MainController::class, 'index'])->name('home');
Route::get('/hoteles/{hotel}/show', [HoteleController::class, 'show'])->name('hoteles.show');
Route::get('/busqueda', [SearchController::class, 'busqueda'])->name('busqueda');
Route::get('/api/sugerencias', [SearchController::class, 'sugerencias'])->name('api.sugerencias');
Route::get('/contacto-propietario', [ContactoController::class, 'showForm'])->name('contacto.form');
Route::post('/contacto-propietario', [ContactoController::class, 'enviarSolicitud'])->name('contacto.send');
Route::get('/experiencias', [ActividadeController::class, 'publicIndex'])->name('experiencias.index'); // Movida aquí para que los clientes vean las experiencias antes de loguearse

Route::middleware(['auth'])->group(function () {
    

    Route::post('/reservas', [ReservaController::class, 'store'])->name('reservas.store');
    Route::get('/carrito', [ReservaController::class, 'getCart'])->name('reservas.carrito');
    Route::post('/reservas/cancelar/{id}', [ReservaController::class, 'solicitarCancelacion'])->name('reservas.cancelar');
    Route::delete('/reservas/{reserva}', [ReservaController::class, 'destroy'])->name('reservas.destroy');
    Route::post('/hoteles/{hotel}/reviews', [HoteleController::class, 'storeReview'])->name('hoteles.reviews.store'); // Limpiado middleware repetido
    
    Route::post('/pago', [PagoController::class, 'checkout'])->name('pago.checkout');
    Route::get('/pago/exito', [PagoController::class, 'exito'])->name('pago.exito'); 
    Route::get('/pago/cancelado', function() {
        return redirect()->route('reservas.carrito')->with('error', 'El pago fue cancelado.');
    })->name('pago.cancelado');
    
    Route::get('/mis-reservas', [ReservaController::class, 'index'])->name('reservas.index');
    Route::get('/reservas/{reserva}/descargar-factura', [FacturaController::class, 'descargar'])->name('reservas.factura');
    Route::get('/reservas/{reserva}/descargar-qr', [ReservaController::class, 'descargarQR'])->name('reservas.qr');
});


Route::middleware(['auth', 'role:admin|propietario'])->group(function () {
    Route::resource('hoteles', HoteleController::class)->except(['show']);
    Route::resource('ofertas', OfertaController::class);
    Route::patch('ofertas/{oferta}/toggle', [OfertaController::class, 'toggle'])->name('ofertas.toggle');
    Route::post('/hoteles/generar-habitaciones-masa', [HoteleController::class, 'generarHabitacionesMasa'])->name('hoteles.generarHabitacionesMasa');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('actividades', ActividadeController::class);
    Route::resource('tipos', TipoController::class);
    Route::resource('categorias', CategoriaController::class);
    Route::resource('usuarios', UserController::class); 
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';