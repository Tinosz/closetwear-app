<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('item_name')->index();
            $table->integer('item_price');
            $table->longText('item_description');
            $table->string('tokopedia_link');
            $table->string('shoppee_link');
            $table->string('whatsapp_link');
            $table->string('available_stock');
            $table->integer('item_click')->default(0);
            $table->integer('item_link_click')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item');
    }
};
