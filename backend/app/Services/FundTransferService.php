<?php

namespace App\Services;

use App\Models\Distributor;
use App\Models\FundTransfer;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class FundTransferService
{
    public function create(
        int $distributorId,
        string $amount,
        string $type,
        ?string $remarks = null
    ): FundTransfer {
        return DB::transaction(function () use (
            $distributorId,
            $amount,
            $type,
            $remarks
        ) {
            $distributor = Distributor::query()
                ->whereKey($distributorId)
                ->lockForUpdate()
                ->firstOrFail();

            $currentBalance = (float) $distributor->current_balance;
$transferAmount = (float) $amount;

if (
    $type === 'debit'
    && $currentBalance < $transferAmount
) {
    throw new RuntimeException(
        'Insufficient balance for this debit.'
    );
}

$newBalance = $type === 'credit'
    ? $currentBalance + $transferAmount
    : $currentBalance - $transferAmount;

$newBalance = number_format(
    $newBalance,
    2,
    '.',
    ''
);

            $distributor->update([
                'current_balance' => $newBalance,
            ]);

            return FundTransfer::create([
                'distributor_id' => $distributor->id,
                'amount' => $amount,
                'type' => $type,
                'balance_after' => $newBalance,
                'remarks' => $remarks,
            ]);
        });
    }
}