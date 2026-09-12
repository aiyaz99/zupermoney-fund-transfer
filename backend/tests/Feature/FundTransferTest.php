<?php

namespace Tests\Feature;

use App\Models\Distributor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FundTransferTest extends TestCase
{
    use RefreshDatabase;

    protected function authenticateAdmin(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );
    }

    public function test_admin_can_create_credit(): void
    {
        $this->authenticateAdmin();

        $distributor = Distributor::create([
            'name' => 'Test Distributor',
            'current_balance' => 50000.00,
        ]);

        $response = $this->postJson('/api/fund-transfers', [
            'distributor_id' => $distributor->id,
            'amount' => 5000,
            'type' => 'credit',
            'remarks' => 'Test credit',
        ]);

        $response
            ->assertStatus(201)
            ->assertJsonPath(
                'data.balance_after',
                '55000.00'
            );

        $this->assertDatabaseHas('distributors', [
            'id' => $distributor->id,
            'current_balance' => '55000.00',
        ]);

        $this->assertDatabaseHas('fund_transfers', [
            'distributor_id' => $distributor->id,
            'amount' => '5000.00',
            'type' => 'credit',
            'balance_after' => '55000.00',
        ]);
    }

    public function test_admin_can_create_debit(): void
    {
        $this->authenticateAdmin();

        $distributor = Distributor::create([
            'name' => 'Test Distributor',
            'current_balance' => 50000.00,
        ]);

        $response = $this->postJson('/api/fund-transfers', [
            'distributor_id' => $distributor->id,
            'amount' => 10000,
            'type' => 'debit',
            'remarks' => 'Test debit',
        ]);

        $response
            ->assertStatus(201)
            ->assertJsonPath(
                'data.balance_after',
                '40000.00'
            );

        $this->assertDatabaseHas('distributors', [
            'id' => $distributor->id,
            'current_balance' => '40000.00',
        ]);
    }

    public function test_debit_cannot_make_balance_negative(): void
    {
        $this->authenticateAdmin();

        $distributor = Distributor::create([
            'name' => 'Test Distributor',
            'current_balance' => 5000.00,
        ]);

        $response = $this->postJson('/api/fund-transfers', [
            'distributor_id' => $distributor->id,
            'amount' => 6000,
            'type' => 'debit',
        ]);

        $response
            ->assertStatus(422)
            ->assertJson([
                'message' => 'Insufficient balance for this debit.',
            ]);

        $this->assertDatabaseHas('distributors', [
            'id' => $distributor->id,
            'current_balance' => '5000.00',
        ]);

        $this->assertDatabaseMissing('fund_transfers', [
            'distributor_id' => $distributor->id,
            'type' => 'debit',
        ]);
    }

    public function test_transfer_validation_rejects_invalid_amount(): void
    {
        $this->authenticateAdmin();

        $distributor = Distributor::create([
            'name' => 'Test Distributor',
            'current_balance' => 50000.00,
        ]);

        $response = $this->postJson('/api/fund-transfers', [
            'distributor_id' => $distributor->id,
            'amount' => 0,
            'type' => 'credit',
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'amount',
            ]);
    }

    public function test_ledger_can_be_filtered_by_distributor(): void
    {
        $this->authenticateAdmin();

        $firstDistributor = Distributor::create([
            'name' => 'First Distributor',
            'current_balance' => 50000.00,
        ]);

        $secondDistributor = Distributor::create([
            'name' => 'Second Distributor',
            'current_balance' => 30000.00,
        ]);

        $this->postJson('/api/fund-transfers', [
            'distributor_id' => $firstDistributor->id,
            'amount' => 1000,
            'type' => 'credit',
        ])->assertStatus(201);

        $this->postJson('/api/fund-transfers', [
            'distributor_id' => $secondDistributor->id,
            'amount' => 2000,
            'type' => 'credit',
        ])->assertStatus(201);

        $response = $this->getJson(
            "/api/fund-transfers?distributor_id={$firstDistributor->id}"
        );

        $response
            ->assertStatus(200)
            ->assertJsonCount(1, 'data');

        $response->assertJsonPath(
            'data.0.distributor_id',
            $firstDistributor->id
        );
    }

    public function test_ledger_supports_pagination(): void
    {
        $this->authenticateAdmin();

        $distributor = Distributor::create([
            'name' => 'Test Distributor',
            'current_balance' => 50000.00,
        ]);

        for ($i = 1; $i <= 3; $i++) {
            $this->postJson('/api/fund-transfers', [
                'distributor_id' => $distributor->id,
                'amount' => 100,
                'type' => 'credit',
            ])->assertStatus(201);
        }

        $response = $this->getJson(
            "/api/fund-transfers?distributor_id={$distributor->id}&per_page=2"
        );

        $response
            ->assertStatus(200)
            ->assertJsonPath('per_page', 2)
            ->assertJsonPath('total', 3)
            ->assertJsonCount(2, 'data');
    }

    public function test_transfer_requires_authentication(): void
    {
        $distributor = Distributor::create([
            'name' => 'Test Distributor',
            'current_balance' => 50000.00,
        ]);

        $response = $this->postJson('/api/fund-transfers', [
            'distributor_id' => $distributor->id,
            'amount' => 1000,
            'type' => 'credit',
        ]);

        $response->assertStatus(401);
    }
}