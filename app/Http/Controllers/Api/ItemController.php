<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Http\Resources\ItemResource;
use App\Models\Image;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Item::with('categories', 'images')->get();

        return response()->json($items);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreItemRequest $request)
    {
        $data = $request->validated();

        $item = Item::create($data);

        // Handle categories
        $categoryIds = $request->input('categories');
        foreach ($categoryIds as $categoryId) {
            $item->categories()->attach($categoryId);
        }

        $itemImages = $request->file('item_image');
        foreach ($itemImages as $index => $image) {
            $imagePath = $image->store('images', 'public');

            Image::create([
                'item_id' => $item->id,
                'item_image' => $imagePath,
                'item_image_order' => $data['item_image_order'][$index],
            ]);
        }


        return response(new ItemResource($item), 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(Item $item)
    {
        return new ItemResource($item->load('images', 'categories'));
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateItemRequest $request, Item $item)
    {
        $data = $request->validated();

        if(array_key_exists('item_image', $data)){
            $newOrder = $data['item_image'];
            foreach ($newOrder as $imageData) {
                $imagePath = $imageData['path'];
                $order = $imageData['item_image_order'];

                $item->images()->where('item_image', $imagePath)->update(['item_image_order' => $order]);
            }
        }

        if(array_key_exists("categories", $data)){
            $item->categories()->sync($data['categories']);
        }

        $item->update($data);

        return response(new ItemResource($item), 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        $images = $item->images;
        $categories = $item->categories;
    
        foreach ($images as $image) {
            Storage::delete($image->item_image);
        }
    
        $item->images()->delete();
    
        $item->categories()->detach();
    
        foreach ($categories as $category) {
            $category->items()->detach($item->id);
        }
    
        $item->delete();
    }
}
