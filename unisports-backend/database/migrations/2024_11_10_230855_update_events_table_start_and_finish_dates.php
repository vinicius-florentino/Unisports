<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{

    public function up(): void
    {
        DB::statement("ALTER TABLE events CHANGE COLUMN `date` `start_at` DATETIME NOT NULL");
        DB::statement("ALTER TABLE events ADD COLUMN `finishes_at` DATETIME NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE events CHANGE COLUMN `start_at` `date` DATETIME NOT NULL");
        DB::statement("ALTER TABLE events DROP COLUMN `finishes_at`");
    }
};
