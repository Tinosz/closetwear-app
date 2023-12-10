<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ItemController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::middleware('auth:sanctum')->group(function() {
    Route::get('/user', function (Request $request) {
        return $request->user();
}); 
    Route::apiResource('/categories', CategoryController::class);
    Route::delete('/items/delete-multiple', [ItemController::class, 'multipleDelete']);
    Route::apiResource('/items', ItemController::class);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/admin/user', [AuthController::class, 'getAdminUserData']);
    Route::delete('/banners/delete-multiple', [BannerController::class, 'multipleDelete']);
    Route::apiResource('/banners', BannerController::class);
});
Route::post('/adminLogin', [AuthController::class, 'adminLogin']);
Route::get('/items', [ItemController::class, 'index']);
Route::post('/items/{item}/increment-click', [ItemController::class, 'incrementItemClick']);
Route::get('/banners', [BannerController::class, 'index']);

Route::get('/adminSearch', [ItemController::class, "itemSearch"]);

Route::get('/categories', [CategoryController::class, 'index']);

