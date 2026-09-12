<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('fund_transfers', function (Blueprint $table) {
        $table->id();

        $table->foreignId('distributor_id')
            ->constrained('distributors')
            ->cascadeOnDelete();

        $table->decimal('amount', 15, 2);

        $table->enum('type', ['credit', 'debit']);

        $table->decimal('balance_after', 15, 2);

        $table->text('remarks')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fund_transfers');
    }
};
