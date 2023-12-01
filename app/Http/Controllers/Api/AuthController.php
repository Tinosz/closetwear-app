<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminLoginRequest;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function adminLogin(AdminLoginRequest $request)
    {
        $login = $request->input('username');
        $password = $request->input('password');

        $admin = Admin::whereRaw('BINARY username = ?', [$login])->first();

        $admin = Admin::where('username', $login)->first();

        if(!$admin || !Hash::check($password, $admin->password)){
            return response([
                'message' => 'the provided username or password is incorrect',
            ], 422);
        }

        Auth::guard('admin')->login($admin);

        $token = $admin->createToken('main')->plainTextToken;
        return response(compact('admin', 'token'));
    }

    public function getAdminUserData(Request $request)
    {
        $adminData = Admin::where('id', $request->user()->id)->first();

        if($adminData){
            return response()->json($adminData);
        } else {
            return response()->json(['message' =>'Admin data not found'], 404);
        }
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();    
        return response('', 204);
    }
}
