// Quick test script to verify all APIs are working
async function testAPIs() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Fixed APIs...\n');

  // Test 1: Main products API
  try {
    console.log('1️⃣ Testing /api/products...');
    const productsResponse = await fetch(`${baseUrl}/api/products`);
    const productsData = await productsResponse.json();
    
    if (productsResponse.ok) {
      console.log('✅ Products API working!');
      console.log(`   - Status: ${productsResponse.status}`);
      console.log(`   - Products count: ${productsData.data?.length || productsData.length || 0}`);
      console.log(`   - Using fallback: ${productsData.meta?.fallback || false}`);
    } else {
      console.log('❌ Products API failed:', productsData);
    }
  } catch (error) {
    console.log('❌ Products API error:', error.message);
  }

  console.log('');

  // Test 2: Individual product API
  try {
    console.log('2️⃣ Testing /api/products/[slug]...');
    const productResponse = await fetch(`${baseUrl}/api/products/eggypro-original`);
    const productData = await productResponse.json();
    
    if (productResponse.ok) {
      console.log('✅ Individual Product API working!');
      console.log(`   - Status: ${productResponse.status}`);
      console.log(`   - Product: ${productData.data?.name || productData.name || 'Unknown'}`);
      console.log(`   - Using fallback: ${productData.meta?.fallback || false}`);
    } else {
      console.log('❌ Individual Product API failed:', productData);
    }
  } catch (error) {
    console.log('❌ Individual Product API error:', error.message);
  }

  console.log('');

  // Test 3: Search API
  try {
    console.log('3️⃣ Testing /api/products/search...');
    const searchResponse = await fetch(`${baseUrl}/api/products/search?q=protein`);
    const searchData = await searchResponse.json();
    
    if (searchResponse.ok) {
      console.log('✅ Search API working!');
      console.log(`   - Status: ${searchResponse.status}`);
      console.log(`   - Results count: ${searchData.data?.length || 0}`);
      console.log(`   - Using fallback: ${searchData.meta?.fallback || false}`);
    } else {
      console.log('❌ Search API failed:', searchData);
    }
  } catch (error) {
    console.log('❌ Search API error:', error.message);
  }

  console.log('');

  // Test 4: Stats API
  try {
    console.log('4️⃣ Testing /api/products/stats...');
    const statsResponse = await fetch(`${baseUrl}/api/products/stats`);
    const statsData = await statsResponse.json();
    
    if (statsResponse.ok) {
      console.log('✅ Stats API working!');
      console.log(`   - Status: ${statsResponse.status}`);
      console.log(`   - Total products: ${statsData.data?.totalProducts || 0}`);
      console.log(`   - Using fallback: ${statsData.meta?.fallback || false}`);
    } else {
      console.log('❌ Stats API failed:', statsData);
    }
  } catch (error) {
    console.log('❌ Stats API error:', error.message);
  }

  console.log('\n🎯 API Testing Complete!');
  console.log('\n📝 Next Steps:');
  console.log('   1. Start your dev server: npm run dev');
  console.log('   2. Visit http://localhost:3000 to see products');
  console.log('   3. Visit http://localhost:3000/product/eggypro-original for individual product');
  console.log('   4. Check browser console for any remaining errors');
}

// Run the tests
testAPIs().catch(console.error);