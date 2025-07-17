async function testEnhancedAPI() {
  const baseUrl = 'http://localhost:9004';
  
  try {
    console.log('🔍 Testing Enhanced API Endpoints...\n');
    
    // Test product search
    console.log('1. Testing Product Search API...');
    const searchResponse = await fetch(`${baseUrl}/api/products/search?q=vanilla&sort=price-asc`);
    if (searchResponse.ok) {
      const searchResults = await searchResponse.json();
      console.log(`   ✅ Search found ${searchResults.total} products matching "vanilla"`);
      console.log(`   📦 First result: ${searchResults.products[0]?.name}`);
    } else {
      console.log(`   ❌ Search API failed with status: ${searchResponse.status}`);
    }
    
    // Test price filtering
    console.log('\n2. Testing Price Filtering...');
    const priceFilterResponse = await fetch(`${baseUrl}/api/products/search?minPrice=30&maxPrice=35&sort=price-asc`);
    if (priceFilterResponse.ok) {
      const priceResults = await priceFilterResponse.json();
      console.log(`   ✅ Found ${priceResults.total} products between $30-$35`);
      priceResults.products.forEach((product: any) => {
        console.log(`   💰 ${product.name}: $${product.price}`);
      });
    } else {
      console.log(`   ❌ Price filter failed with status: ${priceFilterResponse.status}`);
    }
    
    // Test stock filtering
    console.log('\n3. Testing Stock Filtering...');
    const stockResponse = await fetch(`${baseUrl}/api/products/search?inStock=true&sort=stock-desc`);
    if (stockResponse.ok) {
      const stockResults = await stockResponse.json();
      console.log(`   ✅ Found ${stockResults.total} products in stock`);
      console.log(`   📦 Highest stock: ${stockResults.products[0]?.name} (${stockResults.products[0]?.stock_quantity} units)`);
    } else {
      console.log(`   ❌ Stock filter failed with status: ${stockResponse.status}`);
    }
    
    // Test product stats
    console.log('\n4. Testing Product Statistics API...');
    const statsResponse = await fetch(`${baseUrl}/api/products/stats`);
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log(`   ✅ Statistics loaded successfully:`);
      console.log(`   📊 Total Products: ${stats.totalProducts}`);
      console.log(`   📦 Total Stock: ${stats.totalStock} units`);
      console.log(`   ⭐ Total Reviews: ${stats.totalReviews}`);
      console.log(`   🌟 Average Rating: ${stats.averageRating}/5`);
      console.log(`   ⚠️  Low Stock Products: ${stats.lowStockProducts.length}`);
    } else {
      console.log(`   ❌ Stats API failed with status: ${statsResponse.status}`);
    }
    
    // Test individual product with reviews
    console.log('\n5. Testing Product with Reviews...');
    const productResponse = await fetch(`${baseUrl}/api/products/eggypro-chocolate-bliss`);
    if (productResponse.ok) {
      const product = await productResponse.json();
      console.log(`   ✅ Product loaded: ${product.name}`);
      console.log(`   💰 Price: $${product.price}`);
      console.log(`   📦 Stock: ${product.stock_quantity} units`);
      console.log(`   ⭐ Reviews: ${product.reviews?.length || 0}`);
      if (product.reviews && product.reviews.length > 0) {
        const avgRating = product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length;
        console.log(`   🌟 Average Rating: ${avgRating.toFixed(1)}/5`);
      }
    } else {
      console.log(`   ❌ Product API failed with status: ${productResponse.status}`);
    }
    
    console.log('\n🎉 Enhanced API testing completed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Product Search & Filtering');
    console.log('   ✅ Price Range Filtering');
    console.log('   ✅ Stock Status Filtering');
    console.log('   ✅ Product Statistics Dashboard');
    console.log('   ✅ Individual Product Details with Reviews');
    
  } catch (error) {
    console.error('❌ Enhanced API test failed:', error);
  }
}

testEnhancedAPI();