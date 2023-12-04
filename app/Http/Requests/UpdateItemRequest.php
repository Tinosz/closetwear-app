<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'item_name' => 'required',
            'item_price' => 'required',
            'item_description' => 'required',
            'tokopedia_link' => 'required',
            'shoppee_link' => 'required',
            'whatsapp_link' => 'required',
            'available_stock' => 'required',
            'item_image' => 'required|image|mimes:jpeg,png,jpg,svg|max:2048',
            'item_image_order' => '||',
            'categories' => 'exists:categories,id',
        ];
    }
}
