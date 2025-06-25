<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Models\CommentAnswer;

class EventCommentAnswer implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public CommentAnswer $commentAnswer;

    public function __construct($commentAnswer)
    {
        $this->commentAnswer = $commentAnswer;
    }

    public function broadcastAs()
    {
        return 'event-comment-answer';
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('event.'.$this->commentAnswer->comment->event_id),
        ];
    }
}