<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBannerRequest extends FormRequest
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
        $rules = [
            'items' => 'exists:items,id',
            'categories' => 'exists:categories,id',
        ];

        if($this->hasFile('banner_image')){
            $rules['banner_image'] = 'required|image|mimes:png,jpg, jpeg, svg|max:2048';

        }

        return $rules;
    }
}
