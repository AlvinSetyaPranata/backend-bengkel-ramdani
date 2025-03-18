<?php

namespace Database\Seeders;

use App\Models\Kendaraan;
use App\Models\User;
use Illuminate\Database\Seeder;

class KendaraanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::pluck('id'); // Get all user IDs

        if ($users->isEmpty()) {
            $this->command->info('No users found. Skipping KendaraanSeeder.');
            return;
        }

        Kendaraan::factory(10)->create([
            'user_id' => $users->random(),
        ]);
    }
}
