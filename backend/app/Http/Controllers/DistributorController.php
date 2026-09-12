<?php

namespace App\Http\Controllers;

use App\Models\Distributor;
use Illuminate\Http\JsonResponse;

class DistributorController extends Controller
{
    public function index(): JsonResponse
    {
        $distributors = Distributor::query()
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'current_balance',
            ]);

        return response()->json([
            'data' => $distributors,
        ]);
    }
}