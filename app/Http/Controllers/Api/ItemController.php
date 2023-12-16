<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Http\Resources\ItemResource;
use App\Models\Category;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{

    public function search()
    {
        // Eager load the 'images' and 'categories' relationships
        $data = Item::with('images', 'categories')->get();
    
        return response()->json([
            'result' => $data
        ], 200);
    }
    

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Item::with('categories', 'images')->get();
        return $items;
    }

    public function indexPaginated(Request $request)
    {
        $perPage = $request->input('per_page', 40); // Number of items per page, default is 10        
        $items = Item::with('categories', 'images')->paginate($perPage);
        return $items;
    }

    public function newlyReleasedItems()
    {
        $items = Item::with('categories', 'images')
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get();
    
        return $items;
    }


    
    public function showItem($id)
    {
        try {
            // Find the main item and eager load the 'categories' and 'images' relationships
            $item = Item::with('categories', 'images')->findOrFail($id);
    
            // Get the category IDs excluding category 1
            $categoryIds = $item->categories->pluck('id')->reject(function ($categoryId) {
                return $categoryId == 1;
            });
    
            // Check if there are multiple categories excluding category 1
            if ($categoryIds->count() > 0) {
                // Find related items with the same categories and eager load the 'categories' and 'images' relationships
                $relatedItems = Item::whereHas('categories', function ($query) use ($categoryIds) {
                    $query->whereIn('category_id', $categoryIds);
                })->with('categories', 'images')->where('id', '!=', $item->id)->take(20)->get();
    
                // Add the related items to the main item
                $item['RecommendedItems'] = $relatedItems;
            } else {
                // If there is only one category, and its ID is 1, search for related items with that category
                $singleCategoryId = $item->categories->pluck('id')->first();
    
                $relatedItems = Item::whereHas('categories', function ($query) use ($singleCategoryId) {
                    $query->where('category_id', $singleCategoryId);
                })->with('categories', 'images')->where('id', '!=', $item->id)->take(20)->get();
    
                // Add the related items to the main item
                $item['RecommendedItems'] = $relatedItems;
            }
    
            return response()->json($item); // Return as JSON with RecommendedItems
        } catch (\Exception $e) {
            // Handle the exception, for example, return an error response
            return response()->json(['error' => 'Item not found'], 404);
        }
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
                'item_image_order' => $request->input('images.'.$index.'.item_image_order'),
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
        $existingImages = $item->images->pluck('item_image')->toArray();
        
        $data = $request->validated();
        
        $item->update($data);
        
        $categoryIds = $request->input('categories');
        $item->categories()->sync($categoryIds);
    
        if ($request->file('images')){
            $images = $request->file('images');
            foreach ($images as $index => $imageData) {
                $imagePath = $imageData['item_image']->store('images', 'public');
    
                Image::create([
                    'item_id' => $item->id,
                    'item_image' => $imagePath,
                    'item_image_order' => $request->input('images.'.$index.'.item_image_order'),                ]);
            }
        } else {
            $imagesData = $request->input('images');
            foreach ($imagesData as $index => $imageData) {
                $imageOrder = $imageData['item_image_order'];
    
                Image::where('item_id', $item->id)
                    ->where('item_image', $imageData['item_image'])
                    ->update(['item_image_order' => $imageOrder]);
            }
        }

        $deletedImages = array_diff($existingImages, $request->input('images.*.item_image'));
        foreach ($deletedImages as $deletedImage) {
            Storage::disk('public')->delete($deletedImage);
    
            Image::where('item_id', $item->id)->where('item_image', $deletedImage)->delete();
        }
        
        return new ItemResource($item);
    }
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        // Check if there are images associated with the item
        if ($item->images->isNotEmpty()) {
            foreach ($item->images as $image) {
                Storage::delete('public/' . $image->item_image);
            }
            $item->images()->delete();
        }


        // Delete the item
        $item->delete();
    }

    public function incrementItemClick(Item $item)
    {
        $item->increment('item_click');

        return response()->json(['message' => 'item click count incremented successfully']);
    }

    public function incrementItemLinkClick(Item $item)
    {
        $item->increment('item_link_click');

        return response()->json(['message' => 'item link click count incremented successfully']);
    }

    public function multipleDelete(Request $request)
    {
        $itemIds = $request->input('itemIds');
    
        // Fetch items to delete
        $itemsToDelete = Item::with('images')->whereIn('id', $itemIds)->get();
    
        foreach ($itemsToDelete as $item) {
            // Check if there are images associated with the item
            if ($item->images->isNotEmpty()) {
                foreach ($item->images as $image) {
                    Storage::delete('public/' . $image->item_image);
                }
    
                $item->images()->delete();
            }
    
            // Delete the item
            $item->delete();
        }
    
        return response("Selected items successfully deleted", 204);
    }

    

    public function searchByCategory(Request $request, $categoryId)
    {
        $perPage = $request->get('per_page', 40); // Number of items per page, default is 10
    
        $category = Category::findOrFail($categoryId);
        $items = $category->items()
            ->with('categories', 'images') // Eager load relationships
            ->paginate($perPage);
    
        return response()->json($items);
    }

    public function recommendedSearch($categoryId = 1){

        $category = Category::find($categoryId) ?? Category::find(1);
    
        $items = $category->items()
            ->with('categories', 'images');
    
        return response()->json($items);
    }
    


}
