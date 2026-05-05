<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Limpiar caché de permisos (Spatie lo recomienda)
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Role::create(['name' => 'admin']);
        Role::create(['name' => 'usuario']);
        Role::create(['name' => 'propietario']);
        Role::create(['name' => 'mantenimiento']);


        Permission::create(['name' => 'editar hoteles']);
        Role::findByName('admin')->givePermissionTo('editar hoteles');
    }
}