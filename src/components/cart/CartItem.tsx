import Image from 'next/image';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import type { CartItem as CartItemType } from '@/lib/cart-types';
import { PriceUtils } from '@/lib/price-utils';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, markItemDeleting, completeItemDeletion } = useCart();
  const itemRef = useRef<HTMLDivElement>(null);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Start delete animation
    markItemDeleting(item.id);
    
    // Complete deletion after animation completes
    setTimeout(() => {
      completeItemDeletion(item.id);
    }, 300);
  };

  const handleQuantityDecrease = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handleQuantityChange(item.quantity - 1);
  };

  const handleQuantityIncrease = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handleQuantityChange(item.quantity + 1);
  };

  const handleItemClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div 
      ref={itemRef}
      className={`flex items-center gap-3 p-3 border-b border-border last:border-b-0 transition-all duration-300 ease-out overflow-hidden ${
        item.isDeleting ? 'opacity-0 scale-95 -translate-x-2' : 'opacity-100 scale-100 translate-x-0'
      } ${!item.isDeleting && item.quantity > 0 ? 'animate-in fade-in-0 slide-in-from-bottom-2' : ''}`}
      onClick={handleItemClick}
    >
      {/* Product Image */}
      <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover rounded-md"
          sizes="(max-width: 768px) 48px, 64px"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow min-w-0">
        <h4 className="font-medium text-sm md:text-base truncate">{item.name}</h4>
        <p className="text-sm text-muted-foreground">{PriceUtils.formatPrice(item.price)} each</p>
        
        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            onClick={item.quantity <= 1 ? handleRemove : handleQuantityDecrease}
            className="h-6 w-6 md:h-7 md:w-7 transition-all duration-200 ease-out hover:scale-110 active:scale-95 hover:shadow-sm"
            aria-label={item.quantity <= 1 ? "Remove item" : "Decrease quantity"}
          >
            <Minus className="h-3 w-3 transition-transform duration-200 ease-out" />
          </Button>
          
          <span className="text-sm font-medium min-w-[2rem] text-center transition-all duration-200 ease-out">
            {item.quantity}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleQuantityIncrease}
            disabled={item.quantity >= 99}
            className="h-6 w-6 md:h-7 md:w-7 transition-all duration-200 ease-out hover:scale-110 active:scale-95 hover:shadow-sm"
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3 transition-transform duration-200 ease-out" />
          </Button>
        </div>
      </div>

      {/* Price and Remove */}
      <div className="flex flex-col items-end gap-2">
        <p 
          key={`${item.id}-${item.quantity}`}
          className="font-semibold text-sm md:text-base transition-all duration-300 ease-out animate-in fade-in-0 slide-in-from-bottom-2"
        >
          {PriceUtils.multiplyPrice(item.price, item.quantity).formatted}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
          aria-label={`Remove ${item.name} from cart. It will delete current item(s).`}
          title="Remove item from cart"
        >
          <Trash2 className="h-4 w-4 transition-transform hover:scale-110 hover:rotate-12" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;