<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Http\Requests\StoreBannerRequest;
use App\Http\Requests\UpdateBannerRequest;
use App\Http\Resources\BannerResource;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $banners = Banner::with('categories', 'items.images')->get();
        return response()->json($banners);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBannerRequest $request)
    {
        $data = $request->validated();
        $banner = Banner::create($data);

        $imagePath = $request->file('banner_image')->store('banner_images', 'public');
        $data['banner_image'] = $imagePath;

        $categoryIds = $request->input('categories');
        $banner->categories()->attach($categoryIds);

        $itemIds = $request->input('items');
        $banner->items()->attach($itemIds);

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
        if($banner->banner_image){
            Storage::delete([
                'public/'.$banner->banner_image
            ]);
        }

        $banner->delete();

        return response("Banner successfully deleted", 204);
    }

    public function multipleDelete(Request $request)
    {
        $bannerIds = $request->input('bannerIds');
    
        // Fetch banner instances based on the provided IDs
        $bannersToDelete = Banner::whereIn('id', $bannerIds)->get();
    
        foreach ($bannersToDelete as $banner) {
            if ($banner->banner_image) {
                Storage::delete('public/' . $banner->banner_image);
            }
            $banner->delete();
        }
    
        return response("Selected banners successfully deleted", 204);
    }
    
    
}
