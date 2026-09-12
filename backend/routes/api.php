<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DistributorController;
use App\Http\Controllers\FundTransferController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/distributors', [
        DistributorController::class,
        'index',
    ]);

    Route::post('/fund-transfers', [
        FundTransferController::class,
        'store',
    ]);

    Route::get('/fund-transfers', [
        FundTransferController::class,
        'index',
    ]);
});