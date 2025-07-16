import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/lib/types';

interface AddToCartButtonProps {
  product: Product;
  quantity: number;
  disabled?: boolean;
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity,
  disabled = false,
  className = '',
}) => {
  const { addItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showGoToCart, setShowGoToCart] = useState(false);

  const handleAddToCart = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    
    try {
      // Simulate brief loading for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      addItem(product, quantity);
      
      // Show success state briefly
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowGoToCart(true);
      }, 1500);
      
      // Auto-reset after showing go to cart option
      setTimeout(() => {
        setShowGoToCart(false);
      }, 8000);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      );
    }
    
    if (showSuccess) {
      return (
        <>
          <Check className="mr-2 h-4 w-4" />
          Added!
        </>
      );
    }
    
    if (showGoToCart) {
      return (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Go to Cart
        </>
      );
    }
    
    return (
      <>
        <ShoppingCart className="mr-2 h-4 w-4" />
        Add to Cart
      </>
    );
  };

  return (
    <Button
      onClick={showGoToCart ? () => window.location.href = '/cart' : handleAddToCart}
      disabled={disabled || isLoading}
      className={`bg-primary hover:bg-primary/90 min-h-[48px] md:min-h-[40px] transition-all ${
        showSuccess ? 'bg-accent hover:bg-accent/90' : ''
      } ${showGoToCart ? 'bg-primary hover:bg-primary/80' : ''} ${className}`}
      aria-label={showGoToCart ? 'Go to cart' : `Add ${quantity} ${product.name} to cart`}
    >
      {getButtonContent()}
    </Button>
  );
};

export default AddToCartButton;