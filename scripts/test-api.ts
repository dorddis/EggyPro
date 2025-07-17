async function testAPI() {
  const baseUrl = 'http://localhost:9004';
  
  try {
    console.log('Testing GET /api/products...');
    const productsResponse = await fetch(`${baseUrl}/api/products`);
    
    if (!productsResponse.ok) {
      throw new Error(`HTTP error! status: ${productsResponse.status}`);
    }
    
    const products = await productsResponse.json();
    console.log('Products fetched successfully:', products.length, 'products');
    console.log('First product:', products[0]);
    
    if (products.length > 0) {
      const firstProductSlug = products[0].slug;
      console.log(`\nTesting GET /api/products/${firstProductSlug}...`);
      
      const productResponse = await fetch(`${baseUrl}/api/products/${firstProductSlug}`);
      
      if (!productResponse.ok) {
        throw new Error(`HTTP error! status: ${productResponse.status}`);
      }
      
      const product = await productResponse.json();
      console.log('Single product fetched successfully');
      console.log('Product name:', product.name);
      console.log('Stock quantity:', product.stock_quantity);
      console.log('Reviews count:', product.reviews?.length || 0);
    }
    
  } catch (error) {
    console.error('API test failed:', error);
  }
}

testAPI();