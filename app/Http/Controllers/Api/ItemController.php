<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Http\Resources\ItemResource;
use App\Models\Image;
use GuzzleHttp\Psr7\UploadedFile;
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
        $item->categories()->attach($categoryIds);
        $item->categories()->attach(1);
    
        $images = $request->file('images');
        foreach ($images as $index => $imageData) {
            $imagePath = $imageData['item_image']->store('images', 'public');
            
            Image::create([
                'item_id' => $item->id,
                'item_image' => $imagePath,
                'item_image_order' => $request->input('images.'.$index.'.item_image_order'), // Corrected line
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
    
        if (isset($data['images']) && is_array($data['images'])) {
            foreach ($item->images as $image) {
                Storage::disk('public')->delete($image->item_image);
                $image->delete();
            }

            foreach ($data['images'] as $imageData) {
                // Check if $imageData is an instance of UploadedFile
                if ($imageData instanceof UploadedFile) {
                    // Handle file upload logic
                    $imagePath = $imageData['item_image']->store('images', 'public');
            
                    $imageId = $imageData['image_id']; // Assuming you have an 'image_id' key in your image data
            
                    // Delete previous image with the same ID
                    Image::find($imageId)->delete();
            
                    // Create a new record for the updated image
                    Image::create([
                        'item_id' => $item->id,
                        'item_image' => $imagePath,
                        'item_image_order' => $imageData['item_image_order'],
                    ]);
                }
            }            
        }
    
        // Update other item fields
        $item->update([
            'item_name' => $data['item_name'],
            'item_price' => $data['item_price'],
            'item_description' => $data['item_description'],
            'tokopedia_link' => $data['tokopedia_link'],
            'shoppee_link' => $data['shoppee_link'],
            'whatsapp_link' => $data['whatsapp_link'],
            'available_stock' => $data['available_stock'],
        ]);
    
        // Handle categories
        $item->categories()->sync($data['categories']);
    
        return response(new ItemResource($item), 200);
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
