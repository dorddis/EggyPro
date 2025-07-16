import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';
import { validateQuantity } from '@/lib/cart-utils';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState(quantity.toString());

  const handleDecrease = () => {
    const newQuantity = Math.max(min, quantity - 1);
    if (validateQuantity(newQuantity)) {
      onQuantityChange(newQuantity);
      setInputValue(newQuantity.toString());
    }
  };

  const handleIncrease = () => {
    const newQuantity = Math.min(max, quantity + 1);
    if (validateQuantity(newQuantity)) {
      onQuantityChange(newQuantity);
      setInputValue(newQuantity.toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && validateQuantity(numValue) && numValue >= min && numValue <= max) {
      onQuantityChange(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || !validateQuantity(numValue) || numValue < min || numValue > max) {
      setInputValue(quantity.toString());
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
        className="h-9 w-9 md:h-8 md:w-8 shrink-0 transition-all duration-200 ease-out hover:scale-110 active:scale-95 hover:shadow-sm"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4 transition-transform duration-200 ease-out" />
      </Button>
      
      <Input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        disabled={disabled}
        min={min}
        max={max}
        className="w-16 md:w-14 text-center h-9 md:h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all duration-200 ease-out"
        aria-label="Quantity"
      />
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrease}
        disabled={disabled || quantity >= max}
        className="h-9 w-9 md:h-8 md:w-8 shrink-0 transition-all duration-200 ease-out hover:scale-110 active:scale-95 hover:shadow-sm"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4 transition-transform duration-200 ease-out" />
      </Button>
    </div>
  );
};

export default QuantitySelector;