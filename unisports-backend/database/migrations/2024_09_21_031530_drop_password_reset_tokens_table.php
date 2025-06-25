<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('password_reset_tokens');
    }

    public function down(): void
    {
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->collate('utf8mb4_unicode_ci')->primary();
            $table->string('token')->collate('utf8mb4_unicode_ci');
            $table->timestamp('created_at')->nullable();
        });
    }
};
