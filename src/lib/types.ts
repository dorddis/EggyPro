export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  ingredients: string[];
  details: string;
  slug: string;
}

export interface Review {
  id: string;
  productId: string;
  reviewerName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  imageUrl?: string; // Optional photo of product in use or reviewer
  videoUrl?: string; // Optional video testimonial
}

export interface Testimonial extends Omit<Review, 'productId' | 'rating'> {
  title: string;
  rating?: number; // Keep rating optional for general testimonials if needed
}
