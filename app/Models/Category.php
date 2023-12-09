<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_name',
    ];

    public function items()
    {
        return $this->belongsToMany(Item::class, 'category_item', 'category_id', 'item_id');
    }

    public function banners()
    {
        return $this->belongsToMany(Banner::class, 'category_banner', 'category_id', 'banner_id');
    }

    protected $table = 'categories';
}
