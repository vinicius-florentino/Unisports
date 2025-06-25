<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordResetToken extends Model
{
    protected $primaryKey = 'user_email';
    public $timestamps = false;

    protected $fillable = [
        'user_email',
        'token',
        'expires_at',
    ];

    protected $hidden = [
        'token',
    ];

    protected $casts = [
        'expires_at' => 'timestamp',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_email', 'email');
    }
    
}
