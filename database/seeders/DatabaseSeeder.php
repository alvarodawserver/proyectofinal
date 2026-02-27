<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        //User::factory()->create([
        //    'name' => 'Test User',
        //    'email' => 'test@example.com',
        //]);


        $admin = Role::create(['name' => 'admin']);
        $owner = Role::create(['name' => 'owner']);
        $maintenance = Role::create(['name' => 'maintenance']);
        $user = Role::create(['name' => 'user']);

        // Asignar a un usuario específico
        $myUser = User::find(1);
        $myUser->assignRole('admin');
    }
}
