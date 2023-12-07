<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_name',
        'item_price',
        'item_description',
        'tokopedia_link',
        'shoppee_link',
        'whatsapp_link',
        'available_stock',
        'item_click',
        'item_link_click',
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_item', 'item_id', 'category_id');
    }

    public function images()
    {
        return $this->hasMany(Image::class, 'item_id');
    }

}
