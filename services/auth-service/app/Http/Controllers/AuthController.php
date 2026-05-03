<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    // 🔑 LOGIN EMAIL + PASSWORD
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth()->attempt($credentials)) {
            return response()->json([
                'error' => 'Unauthorized'
            ], 401);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer'
        ]);
    }

    // 🔄 REFRESH TOKEN
    public function refresh()
    {
        return response()->json([
            'access_token' => auth()->refresh(),
            'token_type' => 'bearer'
        ]);
    }

    // 🚪 LOGOUT
    public function logout()
    {
        auth()->logout();

        return response()->json([
            'message' => 'Logged out'
        ]);
    }
}