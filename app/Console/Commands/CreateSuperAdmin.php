<?php

namespace App\Console\Commands;

use App\Models\Admin;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateSuperAdmin extends Command
{
    protected $signature = 'admin:create-super';
    protected $description = 'Buat akun Super Admin pertama';

    public function handle()
    {
        if (Admin::where('role', 'super_admin')->exists()) {
            $this->error('Super Admin sudah ada!');
            return 1;
        }

        $name = $this->ask('Masukkan nama Super Admin:');
        $email = $this->ask('Masukkan email Super Admin:');
        $password = $this->secret('Masukkan password Super Admin:');

        $admin = Admin::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'super_admin',
        ]);

        $this->info('Super Admin berhasil dibuat!');
        $this->table(
            ['Nama', 'Email', 'Role'],
            [[$admin->name, $admin->email, $admin->role]]
        );

        return 0;
    }
}
