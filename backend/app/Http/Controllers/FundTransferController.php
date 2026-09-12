<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFundTransferRequest;
use App\Models\FundTransfer;
use App\Services\FundTransferService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class FundTransferController extends Controller
{
    public function __construct(
        private FundTransferService $fundTransferService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'distributor_id' => [
                'nullable',
                'integer',
                'exists:distributors,id',
            ],
            'from' => [
                'nullable',
                'date',
            ],
            'to' => [
                'nullable',
                'date',
                'after_or_equal:from',
            ],
            'per_page' => [
                'nullable',
                'integer',
                'min:1',
                'max:100',
            ],
        ]);

        $perPage = $validated['per_page'] ?? 10;

        $transfers = FundTransfer::query()
            ->with('distributor')
            ->when(
                $validated['distributor_id'] ?? null,
                fn ($query, $distributorId) =>
                    $query->where(
                        'distributor_id',
                        $distributorId
                    )
            )
            ->when(
                $validated['from'] ?? null,
                fn ($query, $from) =>
                    $query->whereDate(
                        'created_at',
                        '>=',
                        $from
                    )
            )
            ->when(
                $validated['to'] ?? null,
                fn ($query, $to) =>
                    $query->whereDate(
                        'created_at',
                        '<=',
                        $to
                    )
            )
            ->orderBy('created_at')
            ->orderBy('id')
            ->paginate($perPage);

        return response()->json($transfers);
    }

    public function store(
        StoreFundTransferRequest $request
    ): JsonResponse {
        $validated = $request->validated();

        try {
            $transfer = $this->fundTransferService->create(
                distributorId: (int) $validated['distributor_id'],
                amount: (string) $validated['amount'],
                type: $validated['type'],
                remarks: $validated['remarks'] ?? null,
            );

            return response()->json([
                'message' =>
                    'Fund transfer created successfully.',
                'data' => $transfer->load('distributor'),
            ], 201);

        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}