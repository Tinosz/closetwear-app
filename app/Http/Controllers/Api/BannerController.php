<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Http\Requests\StoreBannerRequest;
use App\Http\Requests\UpdateBannerRequest;
use App\Http\Resources\BannerResource;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $banners = Banner::with('categories', 'items.images')
            ->orderBy('banner_order')
            ->get();
    
        return response()->json($banners);
    }
    

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBannerRequest $request)
    {
        // Validate the request data
        $data = $request->validated();
    
        // Count the existing banners and increment by 1 for the new banner_order
        $bannerOrder = Banner::count() + 1;
    
        // Handle banner image upload
        $imagePath = $request->file('banner_image')->store('banner_images', 'public');
        $data['banner_image'] = $imagePath;
    
        // Create the banner with the new banner_order
        $banner = Banner::create([
            'banner_order' => $bannerOrder,
            'banner_image' => $data['banner_image'], // Assign banner_image here
        ]);
    
        // Attach categories and items
        $categoryIds = $request->input('categories');
        $banner->categories()->attach($categoryIds);
    
        $itemIds = $request->input('items');
        $banner->items()->attach($itemIds);
    
        // Update the banner with the final data
        $banner->update($data);
    
        return response(new BannerResource($banner), 201);
    }
    
    

    /**
     * Display the specified resource.
     */
    public function show(Banner $banner)
    {
        return new BannerResource($banner->load('items', 'categories'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBannerRequest $request, Banner $banner)
    {
        $data = $request->validated();

        $categoryIds = $request->input('categories');
        $banner->categories()->sync($categoryIds);

        $itemIds = $request->input('items');
        $banner->items()->sync($itemIds);

        if($request->hasFile('banner_image')){
            Storage::delete(['public/' . $banner->banner_image]);


            $imagePath = $request->file('banner_image')->store('banner_images', 'public');
            $data['banner_image'] = $imagePath;
        }

        $banner->update($data);

        return new BannerResource($banner);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Banner $banner)
    {
        $bannerOrder = $banner->banner_order;
    
        if ($banner->banner_image) {
            Storage::delete(['public/'.$banner->banner_image]);
        }
    
        $banner->delete();
    
        // Decrement the banner_order for banners with order greater than the deleted banner
        Banner::where('banner_order', '>', $bannerOrder)
            ->decrement('banner_order');
    
        return response("Banner successfully deleted", 204);
    }
    

    public function multipleDelete(Request $request)
    {
        $bannerIds = $request->input('bannerIds');
        
        // Fetch banner instances based on the provided IDs
        $bannersToDelete = Banner::whereIn('id', $bannerIds)->get();
    
        // Get the banner_order of banners to be deleted
        $deletedBannerOrders = $bannersToDelete->pluck('banner_order')->toArray();
    
        // Delete the banners
        foreach ($bannersToDelete as $banner) {
            if ($banner->banner_image) {
                Storage::delete('public/' . $banner->banner_image);
            }
            $banner->delete();
        }
    
        // Fetch the remaining banners ordered by banner_order
        $remainingBanners = Banner::orderBy('banner_order')->get();
    
        // Update the banner_order for the remaining banners
        foreach ($remainingBanners as $index => $remainingBanner) {
            $newOrder = $index + 1;
            
            // If the new order is not equal to the current order, update it
            if ($newOrder != $remainingBanner->banner_order) {
                $remainingBanner->update(['banner_order' => $newOrder]);
            }
        }
    
        return response("Selected banners successfully deleted", 204);
    }
    
    public function updateBannerOrder(Request $request)
    {
        $bannersData = $request->all();
    
        $bannerIds = $bannersData['id'];
        $bannerOrders = $bannersData['banner_order'];
    
        // Combine arrays into pairs
        $bannerDataPairs = array_combine($bannerIds, $bannerOrders);
    
        foreach ($bannerDataPairs as $bannerId => $bannerOrder) {
            // Find the banner by ID
            $banner = Banner::find($bannerId);
    
            if ($banner) {
                // Update banner order if the banner exists
                $banner->update(['banner_order' => $bannerOrder]);
            } else {
                Log::error("Banner ID $bannerId not found!");
            }
        }
    
        return response()->json(['message' => 'Banner order updated successfully']);
    }
    
    public function getRelatedItems($bannerId)
    {
        $banner = Banner::with(['items', 'categories'])->find($bannerId);
    
        if (!$banner) {
            return response()->json(['message' => 'Banner not found'], 404);
        }
    
        $relatedItems = collect();
        $addedItemIds = [];
    
        // Process items related to the banner
        foreach ($banner->items as $item) {
            // Check if the item ID is already added
            if (!in_array($item->id, $addedItemIds)) {
                // Eager load the categories and images relationships
                $item->load('categories', 'images');
    
                $relatedItems->push($item);
                $addedItemIds[] = $item->id; // Add the item ID to the list
            }
        }
    
        foreach ($banner->categories as $category) {
            // Fetch items related to the current category
            $categoryItems = $category->items;
        
            foreach ($categoryItems as $relatedItem) {
                // Check if the related item ID is already added
                if (!in_array($relatedItem->id, $addedItemIds)) {
                    // Eager load the categories and images relationships
                    $relatedItem->load('categories', 'images');
        
                    $relatedItems->push($relatedItem);
                    $addedItemIds[] = $relatedItem->id; // Add the related item ID to the list
                }
            }
        }
    
        // Flatten the collection to remove nested arrays
        $relatedItems = $relatedItems->flatten();
    
        // Paginate the results
        $perPage = 40; // You can adjust this based on your requirements
        $currentPage = request('page', 1); // Get the current page from the request
    
        $pagedResults = $relatedItems->forPage($currentPage, $perPage);
    
        return response()->json(['data' => $pagedResults->values(), 'pagination' => [
            'total' => $relatedItems->count(),
            'per_page' => $perPage,
            'current_page' => $currentPage,
            'last_page' => ceil($relatedItems->count() / $perPage),
        ]]);
    }
    
    
    
    
    
}
