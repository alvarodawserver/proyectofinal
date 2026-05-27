<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // =========================================================================
        // PASO 1: ROLES Y PERMISOS (Spatie)
        // =========================================================================
        $this->call(RolesAndPermissionsSeeder::class);


        // =========================================================================
        // PASO 2: USUARIOS DEL SISTEMA
        // =========================================================================
        
        // 1. Administrador
        $admin = User::create([
            'name' => 'Alvaro Admin',
            'email' => 'admin@proyectofinal.com',
            'password' => Hash::make('password123'),
        ]);
        $admin->assignRole('admin');

        // 2. Propietario 1 (Juan Hotelero)
        $propietario1 = User::create([
            'name' => 'Juan Hotelero',
            'email' => 'propietario@proyectofinal.com',
            'password' => Hash::make('password123'),
        ]);
        $propietario1->assignRole('propietario');

        // 3. Propietario 2 (María Hostelera) - ¡NUEVO!
        $propietario2 = User::create([
            'name' => 'María Hostelera',
            'email' => 'propietario2@proyectofinal.com',
            'password' => Hash::make('password123'),
        ]);
        $propietario2->assignRole('propietario');

        // 4. Usuario normal
        $usuarioNormal = User::create([
            'name' => 'Carlos Cliente',
            'email' => 'usuario@proyectofinal.com',
            'password' => Hash::make('password123'),
        ]);
        $usuarioNormal->assignRole('usuario');


        // =========================================================================
        // PASO 3: CATEGORÍAS
        // =========================================================================
        DB::table('categorias')->insert([
            ['id' => 1, 'nombre' => 'Histórico', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'nombre' => 'Boutique', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'nombre' => 'Lujo', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'nombre' => 'Económico', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'nombre' => 'Romántico', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 6, 'nombre' => 'Negocios', 'created_at' => now(), 'updated_at' => now()],
        ]);


        // =========================================================================
        // PASO 4: SERVICIOS
        // =========================================================================
        DB::table('servicios')->insert([
            ['id' => 1, 'nombre_servicio' => 'Wi-Fi Gratuito', 'icono' => 'Wifi', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'nombre_servicio' => 'Piscina', 'icono' => 'Waves', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'nombre_servicio' => 'Parking privado', 'icono' => 'ParkingCircle', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'nombre_servicio' => 'Desayuno incluido', 'icono' => 'Coffee', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'nombre_servicio' => 'Spa y Bienestar', 'icono' => 'Flower2', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 6, 'nombre_servicio' => 'Gimnasio', 'icono' => 'Dumbbell', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 7, 'nombre_servicio' => 'Recepción 24h', 'icono' => 'Bell', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 8, 'nombre_servicio' => 'Aire acondicionado', 'icono' => 'Snowflake', 'created_at' => now(), 'updated_at' => now()],
        ]);


        // =========================================================================
        // PASO 5: TIPOS DE HABITACIÓN
        // =========================================================================
        DB::table('tipos')->insert([
            ['id' => 1, 'tipo_habitacion' => 'Doble Vista Mar', 'capacidad' => 2, 'precio_base' => 95.00, 'cantidad_habitacion' => 10, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'tipo_habitacion' => 'Doble Jardín', 'capacidad' => 2, 'precio_base' => 75.00, 'cantidad_habitacion' => 15, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'tipo_habitacion' => 'Ático Deluxe', 'capacidad' => 2, 'precio_base' => 160.00, 'cantidad_habitacion' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'tipo_habitacion' => 'Individual', 'capacidad' => 1, 'precio_base' => 45.00, 'cantidad_habitacion' => 10, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'tipo_habitacion' => 'Doble Estándar', 'capacidad' => 2, 'precio_base' => 75.00, 'cantidad_habitacion' => 20, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 6, 'tipo_habitacion' => 'Doble Superior', 'capacidad' => 2, 'precio_base' => 95.00, 'cantidad_habitacion' => 15, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 7, 'tipo_habitacion' => 'Triple Familiar', 'capacidad' => 3, 'precio_base' => 120.00, 'cantidad_habitacion' => 10, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 8, 'tipo_habitacion' => 'Suite Junior', 'capacidad' => 4, 'precio_base' => 180.00, 'cantidad_habitacion' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 9, 'tipo_habitacion' => 'Gran Suite Familiar', 'capacidad' => 5, 'precio_base' => 250.00, 'cantidad_habitacion' => 5, 'created_at' => now(), 'updated_at' => now()],
        ]);


        // =========================================================================
        // PASO 6: HOTELES (12 en total - 6 de Juan, 6 de María)
        // =========================================================================
        DB::table('hoteles')->insert([
            // --- HOTELES DE JUAN (ID 1 al 6) ---
            [
                'id' => 1,
                'nombre_hotel' => 'Palacio de la Arena',
                'propietario_id' => $propietario1->id,
                'descripcion' => 'Hotel boutique en las dunas.',
                'direccion' => 'Calle Arena 1',
                'ciudad' => 'Sanlúcar de Barrameda',
                'latitud' => 36.77000000,
                'longitud' => -6.35000000,
                'estado' => 'disponible',
                'politica_cancelacion' => json_encode([['dias_antes' => '7', 'porcentaje' => '100'], ['dias_antes' => '3', 'porcentaje' => '50']]),
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'id' => 2,
                'nombre_hotel' => 'Oasis del Aljarafe',
                'propietario_id' => $propietario1->id,
                'descripcion' => 'Piscina y naranjos cerca de Sevilla.',
                'direccion' => 'Av. Palmeras 5',
                'ciudad' => 'Sevilla',
                'latitud' => 37.37000000,
                'longitud' => -6.07000000,
                'estado' => 'disponible',
                'politica_cancelacion' => json_encode([['dias_antes' => '7', 'porcentaje' => '100'], ['dias_antes' => '3', 'porcentaje' => '50']]),
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'id' => 3,
                'nombre_hotel' => 'Mirador de la Caleta',
                'propietario_id' => $propietario1->id,
                'descripcion' => 'Vistas increíbles a la catedral.',
                'direccion' => 'Campo del Sur 1',
                'ciudad' => 'Cádiz',
                'latitud' => 36.52000000,
                'longitud' => -6.29000000,
                'estado' => 'disponible',
                'politica_cancelacion' => json_encode([['dias_antes' => '4', 'porcentaje' => '100']]),
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'id' => 4,
                'nombre_hotel' => 'Posada del Lucero',
                'propietario_id' => $propietario1->id,
                'descripcion' => 'Antigua posada del siglo XVIII restaurada en pleno centro histórico.',
                'direccion' => 'Calle Alfarería 22',
                'ciudad' => 'Sevilla',
                'latitud' => 37.38900000,
                'longitud' => -5.99800000,
                'estado' => 'disponible',
                'politica_cancelacion' => json_encode([['dias_antes' => '7', 'porcentaje' => '100']]),
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'id' => 5,
                'nombre_hotel' => 'Hotel Alcázar Real',
                'propietario_id' => $propietario1->id,
                'descripcion' => 'A pasos de la Mezquita con un patio cordobés tradicional espectacular.',
                'direccion' => 'Calle Judería 14',
                'ciudad' => 'Córdoba',
                'latitud' => 37.88200000,
                'longitud' => -4.77900000,
                'estado' => 'disponible',
                'politica_cancelacion' => json_encode([['dias_antes' => '5', 'porcentaje' => '100']]),
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'id' => 6,
                'nombre_hotel' => 'Eco-Resort Doñana',
                'propietario_id' => $propietario1->id,
                'descripcion' => 'Desconecta en plena naturaleza respetando el medio ambiente.',
                'direccion' => 'Camino del Rocío s/n',
                'ciudad' => 'Huelva',
                'latitud' => 37.25600000,
                'longitud' => -6.94000000,
                'estado' => 'disponible',
                'politica_cancelacion' => json_encode([['dias_antes' => '10', 'porcentaje' => '100']]),
                'created_at' => now(), 'updated_at' => now(),
            ],

            // --- HOTELES DE MARÍA (ID 7 al 12) ---
            [
                'id' => 7,
                'nombre_hotel' => 'Gran Hotel Miramar View',
                'propietario_id' => $propietario2->id,
                'descripcion' => 'Vistas al puerto deportivo de Málaga con un diseño vanguardista.',
                'direccion' => 'Paseo Marítimo 45',
                'ciudad' => 'Málaga',
                'latitud' => 36.72000000,
                'longitud' => -4.41000000,
                'estado' => 'disponible',
                'politica_cancelacion' => json_encode([['dias_antes' => '7', 'porcentaje' => '100']]),
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'id' => 8,
                'nombre_hotel' => 'Alhambra Palace Suites',
                'propietario_id' => $propietario2->id,
                'descripcion' => 'Despiértate mirando a la Alhambra en habitaciones de absoluto lujo.',
                'direccion' => 'Paseo de los Tristes 12',
                'ciudad' => 'Granada',
                'latitud' => 37.17700000,
                'longitud' => -3.59000000,
                'estado' => 'disponible',
                'politica_cancelacion' => json_encode([['dias_antes' => '7', 'porcentaje' => '100'], ['dias_antes' => '2', 'porcentaje' => '50']]),
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'id' => 9,
                'nombre_hotel' => 'Hacienda El Sol Boutique',
                'propietario_id' => $propietario2->id,
                'descripcion' => 'Tranquilidad, cata de vinos locales y vistas al río Guadalquivir.',
                'direccion' => 'Calzada de la Duquesa 8',
                'ciudad' => 'Sanlúcar de Barrameda',
                'latitud' => 36.77800000,
                'longitud' => -6.35500000,
                'estado' => 'disponible',
                'politica_cancelacion' => json_encode([['dias_antes' => '3', 'porcentaje' => '100']]),
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'id' => 10,
                'nombre_hotel' => 'Villa Conil Premium',
                'propietario_id' => $propietario2->id,
                'descripcion' => 'Chales independientes con acceso directo a la playa de los Bateles.',
                'direccion' => 'Calle de la Mar 3',
                'ciudad' => 'Conil de la Frontera',
                'latitud' => 36.27400000,
                'longitud' => -6.08800000,
                'estado' => 'disponible',
                'politica_cancelacion' => json_encode([['dias_antes' => '14', 'porcentaje' => '100']]),
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'id' => 11,
                'nombre_hotel' => 'Urban Stay Jerez',
                'propietario_id' => $propietario2->id,
                'descripcion' => 'Hotel moderno y funcional ideal para viajes de negocios o turismo de bodegas.',
                'direccion' => 'Calle Larga 54',
                'ciudad' => 'Jerez de la Frontera',
                'latitud' => 36.68500000,
                'longitud' => -6.13700000,
                'estado' => 'disponible',
                'politica_cancelacion' => json_encode([['dias_antes' => '1', 'porcentaje' => '100']]),
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'id' => 12,
                'nombre_hotel' => 'Sierra Nevada Lodge',
                'propietario_id' => $propietario2->id,
                'descripcion' => 'A pie de pista, perfecto para amantes del esquí y el confort invernal.',
                'direccion' => 'Plaza de Pradollano s/n',
                'ciudad' => 'Granada',
                'latitud' => 37.09500000,
                'longitud' => -3.40100000,
                'estado' => 'disponible',
                'politica_cancelacion' => json_encode([['dias_antes' => '7', 'porcentaje' => '100']]),
                'created_at' => now(), 'updated_at' => now(),
            ],
        ]);


        // =========================================================================
        // PASO 7: RELACIÓN CATEGORÍAS Y HOTELES (Tabla Pivote)
        // =========================================================================
        DB::table('categoria_hotel')->insert([
            ['id' => 1, 'hotele_id' => 1, 'categoria_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'hotele_id' => 1, 'categoria_id' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'hotele_id' => 2, 'categoria_id' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'hotele_id' => 3, 'categoria_id' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'hotele_id' => 4, 'categoria_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 6, 'hotele_id' => 5, 'categoria_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 7, 'hotele_id' => 6, 'categoria_id' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 8, 'hotele_id' => 7, 'categoria_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 9, 'hotele_id' => 8, 'categoria_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 10, 'hotele_id' => 9, 'categoria_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 11, 'hotele_id' => 10, 'categoria_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 12, 'hotele_id' => 11, 'categoria_id' => 6, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 13, 'hotele_id' => 12, 'categoria_id' => 2, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}