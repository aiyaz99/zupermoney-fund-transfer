<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFundTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'distributor_id' => [
                'required',
                'integer',
                'exists:distributors,id',
            ],

            'amount' => [
                'required',
                'numeric',
                'gt:0',
            ],

            'type' => [
                'required',
                Rule::in(['credit', 'debit']),
            ],

            'remarks' => [
                'nullable',
                'string',
                'max:500',
            ],
        ];
    }
}