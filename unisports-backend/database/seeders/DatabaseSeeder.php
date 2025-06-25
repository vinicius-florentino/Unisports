<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $sports = [
            ['title' => 'Musculação', 'icon' => 'fitness_center', 'color' => null],
            ['title' => 'Futebol', 'icon' => 'sports_soccer', 'color' => null],
            ['title' => 'Vôlei', 'icon' => 'sports_volleyball', 'color' => null],
            ['title' => 'Basquete', 'icon' => 'sports_basketball', 'color' => null],
            ['title' => 'Beach Tennis', 'icon' => 'sports_tennis', 'color' => null],
            ['title' => 'Futvolei', 'icon' => 'sports_soccer', 'color' => null],
            ['title' => 'E-Sports', 'icon' => 'sports_esports', 'color' => null],
            ['title' => 'Corrida', 'icon' => 'directions_run', 'color' => null],
            ['title' => 'Ciclismo', 'icon' => 'directions_bike', 'color' => null],
        ];

        foreach ($sports as $sport) {
            \App\Models\Sport::create($sport);
        }
    }
}
