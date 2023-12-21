<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBannerRequest extends FormRequest
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
            'banner_image' => 'required|image|mimes:png,jpg, jpeg, svg|max:5048',
            'items' => 'exists:items,id',
            'categories' => 'exists:categories,id',
            'banner_title' => '||',
            'banner_subtitle' => '||',
            'banner_description' => '||',
            'banner_order' => '||',
        ];
    }
}
