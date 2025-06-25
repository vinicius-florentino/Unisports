<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'max_participants',
        'price',
        'split_price_by_participants',
        'location',
        'start_at',
        'finishes_at',
        'sport_id',
        'image_paths'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'price' => 'float',
        'split_price_by_participants' => 'boolean',
        'start_at' => 'datetime',
        'finishes_at' => 'datetime',
        'location' => 'array',
        'image_paths' => 'array'
    ];

        /**
     * Verifica se o evento está no futuro.
     *
     * @return bool
     */
    public function isActive()
    {
        return Carbon::parse($this->start_at)->isFuture();
    }

    /**
     * Get the user that owns the event.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sport()
    {
        return $this->belongsTo(Sport::class);
    }

    public function participants()
    {
        return $this->hasMany(Participant::class);
    }

    const MAX_EVENTS = 30;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($event) {
            $userId = $event->user_id ?? null;

            if ($userId) {
                if (self::where('user_id', $userId)->count() >= self::MAX_EVENTS) {
                    throw new \Exception('Limite máximo de 30 eventos atingido para este usuário.');
                }
            }
        });
    }
}
