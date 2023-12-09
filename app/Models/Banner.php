<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    protected $fillable = [
        'banner_image'
    ];

    public function items()
    {
        return $this->belongsToMany(Item::class, 'item_banner', 'banner_id', 'item_id');
    }
    
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_banner', 'banner_id', 'category_id');
    }
    public function images()
    {
    }
}
