<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'item_name' => $this->item_name,
            'item_price' => $this->item_price,
            'item_description' => $this->item_description,
            'tokopedia_link' => $this->tokopedia_link,
            'shoppee_link' => $this->shoppee_link,
            'whatsapp_link' => $this->whatsapp_link,
            'available_stock' => $this->available_stock,

            'images' => ImageResource::collection($this->whenLoaded('images')),
            'categories' => CategoryResource::collection($this->whenLoaded('categories')),
        ];
    }
}
