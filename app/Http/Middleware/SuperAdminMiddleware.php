<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SuperAdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user() instanceof \App\Models\Admin || !$request->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Access denied. Super Admin only.'], 403);
        }

        return $next($request);
    }
}