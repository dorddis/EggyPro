import { notFound } from 'next/navigation';
import { products, reviews as allReviews } from '@/lib/constants';
import ProductPageClient from '@/components/product/ProductPageClient';

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const productReviews = allReviews.filter(review => review.productId === product.id);
  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 2);

  return (
    <ProductPageClient 
      product={product} 
      productReviews={productReviews} 
      relatedProducts={relatedProducts} 
    />
  );
}