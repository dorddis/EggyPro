import type { Product, Review, Testimonial } from './types';

export const products: Product[] = [
  {
    id: 'eggypro-original',
    slug: 'eggypro-original',
    name: 'EggyPro Original',
    description: 'The purest form of egg white protein, perfect for muscle recovery and growth. Unflavored to mix with anything.',
    price: 29.99,
    imageUrl: 'https://placehold.co/600x600.png',
    ingredients: ['Egg White Powder', 'Sunflower Lecithin (for mixability)'],
    details: 'EggyPro Original is made from 100% pure egg whites, carefully processed to retain maximum nutritional value. Each serving provides 25g of high-quality protein, essential amino acids, and is virtually fat-free and carb-free. Our eggs are sourced from cage-free farms committed to animal welfare. The powder is instantized for easy mixing, ensuring a smooth, clump-free shake every time. Ideal for post-workout recovery, meal replacement, or boosting your daily protein intake.'
  },
  {
    id: 'eggypro-vanilla',
    slug: 'eggypro-vanilla-dream',
    name: 'EggyPro Vanilla Dream',
    description: 'Deliciously smooth vanilla flavored egg white protein. Naturally sweetened for a guilt-free treat.',
    price: 32.99,
    imageUrl: 'https://placehold.co/600x600.png',
    ingredients: ['Egg White Powder', 'Natural Vanilla Flavor', 'Stevia Leaf Extract', 'Sunflower Lecithin'],
    details: 'Experience the creamy delight of EggyPro Vanilla Dream. This isn\'t just protein; it\'s a treat. We use natural vanilla flavors and sweeten it with stevia, so you can enjoy a delicious shake without any added sugars. With 24g of protein per serving, it helps you build and maintain lean muscle while satisfying your sweet cravings. Sourced from ethical, cage-free farms, because quality and care go hand-in-hand.'
  },
];

export const reviews: Review[] = [
  {
    id: 'review1',
    productId: 'eggypro-original',
    reviewerName: 'Alex P.',
    rating: 5,
    comment: 'Mixes incredibly well and is truly unflavored. My go-to protein now!',
    date: '2024-07-15',
    imageUrl: 'https://placehold.co/100x100.png',
  },
  {
    id: 'review2',
    productId: 'eggypro-original',
    reviewerName: 'Samantha B.',
    rating: 4,
    comment: 'Great quality protein. A bit foamy if shaken too hard, but settles quickly. Results are noticeable.',
    date: '2024-07-10',
  },
  {
    id: 'review3',
    productId: 'eggypro-vanilla-dream',
    reviewerName: 'Mike R.',
    rating: 5,
    comment: 'The Vanilla Dream is amazing! Tastes like a milkshake. No eggy aftertaste at all.',
    date: '2024-07-20',
    videoUrl: 'https://placehold.co/300x200.png?text=Video+Placeholder', // Placeholder for video
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 'testimonial1',
    title: 'Fueling My Fitness Journey!',
    reviewerName: 'Jessica L. - Fitness Enthusiast',
    comment: 'EggyPro has been a game-changer for my post-workout recovery. I trust the ingredients and love the results. The natural sourcing is a huge plus for me!',
    date: '2024-06-25',
    imageUrl: 'https://placehold.co/400x300.png',
  },
  {
    id: 'testimonial2',
    title: 'Clean Protein, Clear Conscience',
    reviewerName: 'Dr. Ben Carter - Nutritionist',
    comment: 'I recommend EggyPro to my clients looking for a high-quality, easily digestible protein source. The company\'s transparency about their sourcing and production is commendable.',
    date: '2024-07-05',
    videoUrl: 'https://placehold.co/400x300.png?text=Video+Placeholder',
  },
];

export const faqExamples = [
  "What are the benefits of egg protein?",
  "Is EggyPro lactose-free?",
  "How is EggyPro manufactured?",
  "What is your shipping policy?",
  "Can I return my product?",
];
