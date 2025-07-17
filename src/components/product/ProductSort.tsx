'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

interface ProductSortProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const sortOptions = [
  { value: '', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'newest', label: 'Newest First' },
  { value: 'stock-desc', label: 'Most in Stock' },
];

export default function ProductSort({ value, onChange, className }: ProductSortProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sort products" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}