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
        $rules = [
            'item_name' => 'required',
            'item_price' => 'required',
            'item_description' => 'required',
            'tokopedia_link' => 'required',
            'shoppee_link' => 'required',
            'whatsapp_link' => 'required',
            'available_stock' => 'required',
            'images.*.item_image_order' => '|',
            'images' => 'required|array',
            'categories' => 'exists:categories,id',
        ];

        // Conditionally apply image validation rules based on file type
        foreach ($this->input('images', []) as $key => $imageData) {
            if ($this->isFile('images.'.$imageData['item_image_order'].'.item_image')) {
                $rules["images.{$key}.item_image"] = 'required|image|mimes:jpeg,png,jpg,svg|max:2048';
            }
        }
        
    
        return $rules;
    }

    /**
     * Check if the given input is a file.
     *
     * @param mixed $input
     * @return bool
     */
    protected function isFile($input): bool
    {
        return is_array($input) && array_key_exists('file', $input) && $input['file'] instanceof \Illuminate\Http\UploadedFile;
    }
}