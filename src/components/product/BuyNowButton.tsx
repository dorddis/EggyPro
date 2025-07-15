import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/lib/types';

interface BuyNowButtonProps {
  product: Product;
  quantity: number;
  disabled?: boolean;
  className?: string;
}

const BuyNowButton: React.FC<BuyNowButtonProps> = ({
  product,
  quantity,
  disabled = false,
  className = '',
}) => {
  const { buyNow } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyNow = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    
    try {
      // Simulate brief loading for better UX
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // buyNow will add item to cart and redirect to checkout
      buyNow(product, quantity);
    } catch (error) {
      console.error('Error processing buy now:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleBuyNow}
      disabled={disabled || isLoading}
      className={`border-primary text-primary hover:bg-primary/10 min-h-[48px] md:min-h-[40px] ${className}`}
      aria-label={`Buy ${quantity} ${product.name} now`}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Zap className="mr-2 h-4 w-4" />
          Buy Now
        </>
      )}
    </Button>
  );
};

export default BuyNowButton;