import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useTruncatedText, getLineClampClass } from '@/lib/text-utils';
import { PriceUtils } from '@/lib/price-utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const truncatedDescription = useTruncatedText(product.description, 'productDescription');
  
  return (
    <Card className="card-equal-height overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-out group hover:scale-[1.02] hover:-translate-y-1">
      <CardHeader className="p-0 overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block">
          <Image
            src={product.images[0] || 'https://placehold.co/400x400.png'}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            data-ai-hint="protein powder product"
          />
        </Link>
      </CardHeader>
      <CardContent className="card-content-grow p-4 md:p-6">
        <Link href={`/product/${product.slug}`}>
          <CardTitle className="text-lg md:text-xl font-semibold mb-2 md:mb-3 hover:text-primary transition-colors duration-200 leading-tight group-hover:text-primary">
            {product.name}
          </CardTitle>
        </Link>
        <p 
          className={`text-sm md:text-base text-muted-foreground mb-3 md:mb-4 ${getLineClampClass(3)} leading-relaxed`}
          title={truncatedDescription.title}
          aria-label={truncatedDescription.ariaLabel}
        >
          {truncatedDescription.displayText}
        </p>
        <p className="text-base md:text-lg font-bold text-primary transition-all duration-200">
          <span className="group-hover:bg-primary/10 group-hover:px-2 group-hover:py-1 group-hover:rounded transition-all duration-200">
            {PriceUtils.formatPrice(product.price)}
          </span>
        </p>
      </CardContent>
      <CardFooter className="card-footer-auto p-4 md:p-6 pt-0">
        <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 min-h-[44px] md:min-h-[40px] transition-all duration-200 group-hover:shadow-lg">
          <Link href={`/product/${product.slug}`}>
            <ShoppingCart className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
