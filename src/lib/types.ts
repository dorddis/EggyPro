export interface Product {
  id: number; // Changed from string to number for database compatibility
  name: string;
  description: string;
  price: number;
  images: string[]; // Changed from imageUrl to images array
  ingredients: string[];
  details: string;
  slug: string;
  stock_quantity: number; // New field for inventory management
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: number; // Changed from string to number
  product_id: number; // Changed from productId and string to number
  reviewer_name: string; // Changed from reviewerName
  reviewer_image_url?: string; // New field
  rating: number;
  comment: string;
  image_url?: string; // Changed from imageUrl
  video_url?: string; // Changed from videoUrl
  is_verified?: boolean;
  created_at?: string;
}

export interface Testimonial extends Omit<Review, 'product_id' | 'rating'> {
  title: string;
  rating?: number;
}

// New types for API responses
export interface ApiProduct extends Product {
  reviews?: Review[];
}

export interface CartItem {
  id: string;
  productId: number; // Updated to match database ID
  name: string;
  price: number;
  quantity: number;
  imageUrl: string; // Keep as single URL for cart display
  slug: string;
  stock_quantity: number; // Add stock tracking to cart items
}

// Admin types
export interface CreateProductData {
  name: string;
  slug: string;
  description: string;
  details: string;
  price: number;
  stock_quantity: number;
  ingredients: string[];
  images?: File[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: number;
}
