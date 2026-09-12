<?php

namespace Database\Seeders;

use App\Models\Distributor;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin user
        User::updateOrCreate(
            [
                'email' => 'admin@example.com',
            ],
            [
                'name' => 'Admin',
                'password' => 'password',
            ]
        );

        // Mock distributors
        Distributor::updateOrCreate(
            ['name' => 'ABC Distributors'],
            ['current_balance' => 50000.00]
        );

        Distributor::updateOrCreate(
            ['name' => 'XYZ Distributors'],
            ['current_balance' => 25000.00]
        );

        Distributor::updateOrCreate(
            ['name' => 'PQR Distributors'],
            ['current_balance' => 75000.00]
        );
    }
}