import { config } from 'dotenv';
import { resolve } from 'path';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { products, reviews } from '../src/lib/db/schema';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Create direct database connection for seeding
// Force use the Supabase URL (system env var is overriding .env.local)
const connectionString = 'postgresql://postgres:mYl93dLOiZCVVWX7@db.namtebydwqsyyiwkzwpb.supabase.co:5432/postgres';
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const client = postgres(connectionString);
const db = drizzle(client);

// Mock data adapted for database seeding
const mockProducts = [
  {
    name: 'EggyPro Original',
    slug: 'eggypro-original',
    description: 'The purest form of egg white protein, perfect for muscle recovery and growth. Unflavored to mix with anything.',
    price: '29.99',
    stock_quantity: 100,
    images: ['https://placehold.co/600x600.png'],
    ingredients: ['Egg White Powder', 'Sunflower Lecithin (for mixability)'],
    details: 'EggyPro Original is made from 100% pure egg whites, carefully processed to retain maximum nutritional value. Each serving provides 25g of high-quality protein, essential amino acids, and is virtually fat-free and carb-free. Our eggs are sourced from cage-free farms committed to animal welfare. The powder is instantized for easy mixing, ensuring a smooth, clump-free shake every time. Ideal for post-workout recovery, meal replacement, or boosting your daily protein intake.'
  },
  {
    name: 'EggyPro Vanilla Dream',
    slug: 'eggypro-vanilla-dream',
    description: 'Deliciously smooth vanilla flavored egg white protein. Naturally sweetened for a guilt-free treat.',
    price: '32.99',
    stock_quantity: 75,
    images: ['https://placehold.co/600x600.png'],
    ingredients: ['Egg White Powder', 'Natural Vanilla Flavor', 'Stevia Leaf Extract', 'Sunflower Lecithin'],
    details: 'Experience the creamy delight of EggyPro Vanilla Dream. This isn\'t just protein; it\'s a treat. We use natural vanilla flavors and sweeten it with stevia, so you can enjoy a delicious shake without any added sugars. With 24g of protein per serving, it helps you build and maintain lean muscle while satisfying your sweet cravings. Sourced from ethical, cage-free farms, because quality and care go hand-in-hand.'
  },
];

const mockReviews = [
  {
    reviewer_name: 'Alex P.',
    rating: 5,
    comment: 'Mixes incredibly well and is truly unflavored. My go-to protein now!',
    image_url: 'https://placehold.co/100x100.png',
    productSlug: 'eggypro-original'
  },
  {
    reviewer_name: 'Samantha B.',
    rating: 4,
    comment: 'Great quality protein. A bit foamy if shaken too hard, but settles quickly. Results are noticeable.',
    productSlug: 'eggypro-original'
  },
  {
    reviewer_name: 'Mike R.',
    rating: 5,
    comment: 'The Vanilla Dream is amazing! Tastes like a milkshake. No eggy aftertaste at all.',
    video_url: 'https://placehold.co/300x200.png?text=Video+Placeholder',
    productSlug: 'eggypro-vanilla-dream'
  },
];

async function seed() {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await db.delete(reviews);
    await db.delete(products);
    
    // Insert products
    console.log('Inserting products...');
    const insertedProducts = await db.insert(products).values(mockProducts).returning();
    console.log(`Inserted ${insertedProducts.length} products`);
    
    // Insert reviews with proper product IDs
    console.log('Inserting reviews...');
    const seededReviews = mockReviews.map(review => {
      const product = insertedProducts.find(p => p.slug === review.productSlug);
      return {
        product_id: product?.id || 1,
        reviewer_name: review.reviewer_name,
        rating: review.rating,
        comment: review.comment,
        image_url: review.image_url,
        video_url: review.video_url,
      };
    });
    
    const insertedReviews = await db.insert(reviews).values(seededReviews).returning();
    console.log(`Inserted ${insertedReviews.length} reviews`);
    
    console.log('Database seeding completed successfully!');
    console.log('Products:', insertedProducts.map(p => ({ id: p.id, name: p.name, stock: p.stock_quantity })));
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log('Seeding finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });