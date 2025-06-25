<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
            INSERT INTO participants (event_id, user_id, created_at, updated_at)
            SELECT id AS event_id, user_id, UTC_TIMESTAMP() AS created_at, UTC_TIMESTAMP() AS updated_at
            FROM events;
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        DB::statement("
            DELETE FROM participants
            WHERE (event_id, user_id) IN (
                SELECT id, user_id
                FROM events
            );
        ");
    }
};
