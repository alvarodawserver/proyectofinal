<?php

use App\Http\Controllers\ActividadeController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\HoteleController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\OfertaController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\TipoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::get('/', [MainController::class, 'index'])->name('home');

Route::get('/hoteles/{hotel}/show', [HoteleController::class, 'show'])->name('hoteles.show');

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('hoteles',HoteleController::class)->except(['show']);
    Route::resource('tipos',TipoController::class);
    Route::resource('actividades',ActividadeController::class);
    Route::resource('categorias',CategoriaController::class);
    Route::resource('ofertas',OfertaController::class);
    Route::patch('ofertas/{oferta}/toggle', [OfertaController::class, 'toggle'])->name('ofertas.toggle');
    
});
    
Route::get('/busqueda', [SearchController::class, 'busqueda'])->name('busqueda');
Route::get('/api/sugerencias', [SearchController::class, 'sugerencias'])->name('api.sugerencias');



require __DIR__.'/settings.php';
