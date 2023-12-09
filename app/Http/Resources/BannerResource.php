<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BannerResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            'id'=> $this->id,
            'banner_image' => $this->banner_image,

            'items' =>ItemResource::collection($this->whenLoaded('items')),
            'categories' =>CategoryResource::collection($this->whenLoaded('categories')),
        ];
    }
}
