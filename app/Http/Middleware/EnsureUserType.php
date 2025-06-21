<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserType
{
    public function handle(Request $request, Closure $next, string $type): Response
    {
        $user = $request->user();

        if ($type === 'admin' && !$user instanceof \App\Models\User) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}
