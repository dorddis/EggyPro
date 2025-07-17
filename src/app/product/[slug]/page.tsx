import { notFound } from 'next/navigation';
import { fetchProduct, fetchProducts } from '@/lib/api';
import ProductPageClient from '@/components/product/ProductPageClient';
import { logger } from '@/lib/logging';

export async function generateStaticParams() {
  try {
    logger.info('STATIC_PARAMS', 'Generating static params for product pages');
    const products = await fetchProducts();
    
    const params = products.map((product) => ({
      slug: product.slug,
    }));
    
    logger.info('STATIC_PARAMS', `Generated ${params.length} static params`, { count: params.length });
    return params;
  } catch (error) {
    logger.error('STATIC_PARAMS', 'Failed to generate static params', error);
    // Return empty array to allow dynamic generation
    return [];
  }
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const pageContext = `ProductPage[${slug}]`;
  
  logger.info(pageContext, 'Loading product page', { slug });
  
  try {
    // Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      logger.error(pageContext, 'Invalid slug parameter', { slug });
      notFound();
    }

    // Fetch product data with error handling
    const productResponse = await fetchProduct(slug);
    
    // Handle the new API response format
    const product = productResponse.data || productResponse;
    const isFallback = productResponse.meta?.fallback || false;
    
    if (!product) {
      logger.error(pageContext, 'No product data received', { slug });
      notFound();
    }

    if (isFallback) {
      logger.warn(pageContext, 'Using fallback data for product page', { slug });
    }

    // Fetch related products with error handling
    let relatedProducts = [];
    try {
      const allProductsResponse = await fetchProducts();
      const allProducts = allProductsResponse.data || allProductsResponse;
      
      if (Array.isArray(allProducts)) {
        relatedProducts = allProducts
          .filter(p => p.id !== product.id)
          .slice(0, 2);
      }
    } catch (relatedError) {
      logger.warn(pageContext, 'Failed to fetch related products, continuing without them', relatedError);
      // Continue without related products rather than failing the entire page
    }

    logger.info(pageContext, 'Successfully loaded product page', { 
      slug, 
      productId: product.id,
      reviewCount: product.reviews?.length || 0,
      relatedCount: relatedProducts.length,
      fallback: isFallback
    });

    return (
      <ProductPageClient 
        product={product} 
        productReviews={product.reviews || []} 
        relatedProducts={relatedProducts} 
      />
    );
  } catch (error) {
    logger.error(pageContext, 'Failed to load product page', { slug, error: error?.message });
    
    // Check if it's a 404 error (product not found)
    if (error?.message?.includes('404') || error?.message?.includes('not found')) {
      logger.info(pageContext, 'Product not found, showing 404 page', { slug });
      notFound();
    }
    
    // For other errors, still show 404 but log as an error
    logger.error(pageContext, 'Unexpected error loading product page', { slug, error });
    notFound();
  }
}