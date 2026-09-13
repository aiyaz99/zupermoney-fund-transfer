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

            if (
                $type === 'debit'
                && bccomp(
                    (string) $distributor->current_balance,
                    $amount,
                    2
                ) < 0
            ) {
                throw new RuntimeException(
                    'Insufficient balance for this debit.'
                );
            }

            $newBalance = $type === 'credit'
                ? bcadd(
                    (string) $distributor->current_balance,
                    $amount,
                    2
                )
                : bcsub(
                    (string) $distributor->current_balance,
                    $amount,
                    2
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