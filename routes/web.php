<?php

use App\Http\Controllers\HoteleController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\SearchController;
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

Route::resource('hoteles',HoteleController::class);
Route::get('/busqueda', [SearchController::class, 'busqueda'])->name('busqueda');



require __DIR__.'/settings.php';
