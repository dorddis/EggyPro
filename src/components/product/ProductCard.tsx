import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Link href={`/product/${product.slug}`} className="block">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-48 sm:h-56 md:h-64 object-cover"
            data-ai-hint="protein powder product"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 md:p-6 flex-grow">
        <Link href={`/product/${product.slug}`}>
          <CardTitle className="text-lg md:text-xl font-semibold mb-2 md:mb-3 hover:text-primary transition-colors leading-tight">{product.name}</CardTitle>
        </Link>
        <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 line-clamp-3 leading-relaxed">{product.description}</p>
        <p className="text-base md:text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 md:p-6 pt-0">
        <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 min-h-[44px] md:min-h-[40px]">
          <Link href={`/product/${product.slug}`}>
            <ShoppingCart className="mr-2 h-4 w-4" /> View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
