<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Models\Comment;

class EventComment implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Comment $comment;

    public function __construct($comment)
    {
        $this->comment = $comment;
    }

    public function broadcastAs()
    {
        return 'event-comment';
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('event.'.$this->comment->event_id),
        ];
    }
}