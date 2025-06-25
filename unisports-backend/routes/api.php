<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Settings\AccountController as SettingsAccountController;
use App\Http\Controllers\Api\EventsController;
use App\Http\Controllers\Api\SportsController;

Route::prefix('v1')->group(function () {

    Route::middleware('auth:sanctum')->group(function () {

        Route::delete('/logout', [AuthController::class, 'logout']);
        Route::post('/email/send-verify-link', [AuthController::class, 'sendVerifyEmailLink']);
        Route::get('/email/verify', [AuthController::class, 'verifyEmail']);

        Route::put('/settings/account', [SettingsAccountController::class, 'update']);
        Route::put('/settings/account/delete', [SettingsAccountController::class, 'destroy']);
        Route::post('/settings/account/image', [SettingsAccountController::class, 'updateImage']);
        Route::delete('/settings/account/image', [SettingsAccountController::class, 'destroyImage']);
        Route::put('/settings/account/password', [SettingsAccountController::class, 'updatePassword']);

        Route::get('/events/dashboard/{id}/participants', [EventsController::class, 'dashboardParticipantsIndex']);
        Route::put('/events/dashboard/{id}/participants/{participantId}', [EventsController::class, 'dashboardParticipantsUpdate']);
        Route::delete('/events/dashboard/{id}/participants/{participantId}', [EventsController::class, 'dashboardParticipantsDestroy']);

        Route::get('/events/dashboard/{id}/gallery/images', [EventsController::class, 'dashboardGalleryImagesIndex']);
        Route::post('/events/dashboard/{id}/gallery/images', [EventsController::class, 'dashboardGalleryImagesStore']);
        Route::delete('/events/dashboard/{id}/gallery/images/{imageIndex}', [EventsController::class, 'dashboardGalleryImagesDelete']);

        Route::get('/events/dashboard', [EventsController::class, 'dashboardIndex']);
        Route::post('/events/dashboard', [EventsController::class, 'dashboardStore']);
        Route::put('/events/dashboard/{id}', [EventsController::class, 'dashboardUpdate']);
        Route::delete('/events/dashboard/{id}', [EventsController::class, 'dashboardDestroy']);

        Route::get('/events/participating', [EventsController::class, 'participatingIndex']);
        
        Route::post('/events/{id}/comments/{commentId}/answers', [EventsController::class, 'commentsAnswersStore']);
        Route::post('/events/{id}/comments', [EventsController::class, 'commentsStore']);

        Route::post('/events/{id}/join', [EventsController::class, 'join']);
        Route::delete('/events/{id}/leave', [EventsController::class, 'leave']);
        
    });

    Route::get('/events/{id}/gallery/images', [EventsController::class, 'galleryImagesIndex']);
    Route::get('/events/{id}/comments', [EventsController::class, 'commentsIndex']);
    Route::get('/events/{id}', [EventsController::class, 'show']);
    Route::get('/events', [EventsController::class, 'index']);
    
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/password/send-reset-link', [AuthController::class, 'sendResetPasswordLink']);
    Route::put('/password/reset', [AuthController::class, 'resetPassword']);

    Route::get('/sports', [SportsController::class, 'index']);
});

