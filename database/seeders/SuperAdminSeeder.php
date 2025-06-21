<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run()
{
    User::create([
        'name' => 'admin',
        'email' => 'admin@email.com',
        'password' => Hash::make('admin12345'),
        'role' => 'superadmin',
    ]);
}
}
