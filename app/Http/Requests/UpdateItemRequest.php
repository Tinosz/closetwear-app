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
            'images.*.item_image_order' => '',
            'images' => 'required|array',
            'categories' => 'exists:categories,id',
        ];
        
        $order = 1;
        
        // Conditionally apply image validation rules based on file type
        foreach ($this->input('images', []) as $key => $imageData) {
            if ($this->file("images.{$order}.item_image")) {
                $rules["images.{$order}.item_image"] = "required|image|mimes:jpeg,png,jpg,svg|max:2048";
            }
        
            // Manually set the error message for the specified rule
            $customMessages["images.{$order}.item_image.max"] = "The images.{$order}.item_image field must not be greater than 2048 kilobytes.";
        
            $order++;
        }
        
        return $rules;
        
        
    }

    /**
     * Check if the given input is a file.
     *
     * @param mixed $input
     * @return bool
     */

}