import { config } from 'dotenv';
import { resolve } from 'path';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { products, reviews } from '../src/lib/db/schema';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Create direct database connection for seeding
const connectionString = 'postgresql://postgres:mYl93dLOiZCVVWX7@db.namtebydwqsyyiwkzwpb.supabase.co:5432/postgres';
const client = postgres(connectionString);
const db = drizzle(client);

// Comprehensive product catalog for a protein supplement store
const comprehensiveProducts = [
  {
    name: 'EggyPro Original',
    slug: 'eggypro-original',
    description: 'The purest form of egg white protein, perfect for muscle recovery and growth. Unflavored to mix with anything.',
    price: '29.99',
    stock_quantity: 150,
    images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Sunflower Lecithin (for mixability)'],
    details: 'EggyPro Original is made from 100% pure egg whites, carefully processed to retain maximum nutritional value. Each serving provides 25g of high-quality protein, essential amino acids, and is virtually fat-free and carb-free. Our eggs are sourced from cage-free farms committed to animal welfare. The powder is instantized for easy mixing, ensuring a smooth, clump-free shake every time. Ideal for post-workout recovery, meal replacement, or boosting your daily protein intake.'
  },
  {
    name: 'EggyPro Vanilla Dream',
    slug: 'eggypro-vanilla-dream',
    description: 'Deliciously smooth vanilla flavored egg white protein. Naturally sweetened for a guilt-free treat.',
    price: '32.99',
    stock_quantity: 120,
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Natural Vanilla Flavor', 'Stevia Leaf Extract', 'Sunflower Lecithin'],
    details: 'Experience the creamy delight of EggyPro Vanilla Dream. This isn\'t just protein; it\'s a treat. We use natural vanilla flavors and sweeten it with stevia, so you can enjoy a delicious shake without any added sugars. With 24g of protein per serving, it helps you build and maintain lean muscle while satisfying your sweet cravings. Sourced from ethical, cage-free farms, because quality and care go hand-in-hand.'
  },
  {
    name: 'EggyPro Chocolate Bliss',
    slug: 'eggypro-chocolate-bliss',
    description: 'Rich chocolate flavored egg protein that tastes like dessert but fuels like a champion.',
    price: '34.99',
    stock_quantity: 95,
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Natural Cocoa Powder', 'Natural Chocolate Flavor', 'Stevia Leaf Extract', 'Sunflower Lecithin'],
    details: 'Indulge in the rich, decadent taste of EggyPro Chocolate Bliss. Made with premium cocoa powder and natural chocolate flavoring, this protein powder delivers 25g of complete protein per serving while satisfying your chocolate cravings. Perfect for post-workout shakes, smoothie bowls, or even baking healthy treats. No artificial sweeteners, just pure chocolate goodness powered by cage-free egg whites.'
  },
  {
    name: 'EggyPro Strawberry Cream',
    slug: 'eggypro-strawberry-cream',
    description: 'Fresh strawberry flavor meets creamy protein perfection in this delightful blend.',
    price: '33.99',
    stock_quantity: 80,
    images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Natural Strawberry Flavor', 'Freeze-Dried Strawberry Powder', 'Stevia Leaf Extract', 'Sunflower Lecithin'],
    details: 'Enjoy the fresh, fruity taste of summer with EggyPro Strawberry Cream. Made with real freeze-dried strawberry powder and natural flavoring, this protein delivers 24g of complete amino acids with a taste that will transport you to strawberry fields. Perfect for morning smoothies, post-workout recovery, or anytime you need a delicious protein boost.'
  },
  {
    name: 'EggyPro Performance Plus',
    slug: 'eggypro-performance-plus',
    description: 'Enhanced formula with added BCAAs and creatine for serious athletes and fitness enthusiasts.',
    price: '39.99',
    stock_quantity: 60,
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'BCAA Complex (L-Leucine, L-Isoleucine, L-Valine)', 'Creatine Monohydrate', 'L-Glutamine', 'Sunflower Lecithin'],
    details: 'Take your training to the next level with EggyPro Performance Plus. This advanced formula combines our premium egg white protein with scientifically-proven performance enhancers. Each serving delivers 26g of protein plus 5g of BCAAs, 3g of creatine, and 2g of glutamine. Designed for serious athletes who demand the best from their supplements. Unflavored for versatility in mixing with your favorite beverages.'
  },
  {
    name: 'EggyPro Lean & Clean',
    slug: 'eggypro-lean-clean',
    description: 'Ultra-pure protein with added fat-burning ingredients for lean muscle development.',
    price: '36.99',
    stock_quantity: 75,
    images: ['https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Green Tea Extract', 'L-Carnitine', 'CLA (Conjugated Linoleic Acid)', 'Sunflower Lecithin'],
    details: 'Achieve your lean physique goals with EggyPro Lean & Clean. This specialized formula combines our high-quality egg protein with natural fat-burning ingredients. Green tea extract provides antioxidants and metabolism support, while L-Carnitine and CLA help optimize fat utilization. With 25g of protein and zero artificial additives, it\'s the perfect choice for those focused on lean muscle development and body composition improvement.'
  },
  {
    name: 'EggyPro Recovery Formula',
    slug: 'eggypro-recovery-formula',
    description: 'Specially formulated for post-workout recovery with added electrolytes and anti-inflammatory compounds.',
    price: '37.99',
    stock_quantity: 85,
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Electrolyte Blend (Sodium, Potassium, Magnesium)', 'Turmeric Extract', 'Tart Cherry Extract', 'Sunflower Lecithin'],
    details: 'Optimize your recovery with EggyPro Recovery Formula. This advanced blend combines our premium egg protein with targeted recovery ingredients. The electrolyte blend helps restore hydration balance, while turmeric and tart cherry extracts provide natural anti-inflammatory support. With 24g of complete protein and recovery-focused nutrients, it\'s your perfect post-workout companion for faster recovery and reduced muscle soreness.'
  },
  {
    name: 'EggyPro Morning Boost',
    slug: 'eggypro-morning-boost',
    description: 'Start your day right with protein plus natural caffeine from green coffee beans.',
    price: '35.99',
    stock_quantity: 90,
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Green Coffee Bean Extract', 'Natural Vanilla Flavor', 'MCT Oil Powder', 'Sunflower Lecithin'],
    details: 'Kickstart your morning with EggyPro Morning Boost. This energizing formula combines our premium egg protein with natural caffeine from green coffee beans, providing sustained energy without the jitters. MCT oil powder adds healthy fats for brain function and satiety. With 25g of protein and 80mg of natural caffeine, it\'s the perfect replacement for your morning coffee and breakfast. Vanilla flavored for a delicious start to your day.'
  },
  {
    name: 'EggyPro Nighttime Recovery',
    slug: 'eggypro-nighttime-recovery',
    description: 'Slow-digesting protein blend with sleep-supporting ingredients for overnight muscle recovery.',
    price: '38.99',
    stock_quantity: 70,
    images: ['https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Casein Protein', 'Magnesium Glycinate', 'L-Theanine', 'Chamomile Extract', 'Sunflower Lecithin'],
    details: 'Maximize your overnight recovery with EggyPro Nighttime Recovery. This unique formula combines fast-absorbing egg protein with slow-digesting casein to provide sustained amino acid release throughout the night. Enhanced with magnesium for muscle relaxation, L-theanine for calm focus, and chamomile for natural sleep support. With 26g of dual-source protein, it supports muscle recovery while you sleep.'
  },
  {
    name: 'EggyPro Plant Fusion',
    slug: 'eggypro-plant-fusion',
    description: 'Innovative blend of egg and plant proteins for the best of both worlds.',
    price: '34.99',
    stock_quantity: 65,
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Pea Protein Isolate', 'Hemp Protein', 'Pumpkin Seed Protein', 'Sunflower Lecithin'],
    details: 'Experience the best of both worlds with EggyPro Plant Fusion. This innovative formula combines our premium egg white protein with carefully selected plant proteins to create a complete amino acid profile with enhanced digestibility. The blend of pea, hemp, and pumpkin seed proteins adds fiber, minerals, and unique plant compounds while maintaining the superior bioavailability of egg protein. Perfect for those seeking variety in their protein sources.'
  },
  {
    name: 'EggyPro Keto Friendly',
    slug: 'eggypro-keto-friendly',
    description: 'Ultra-low carb protein perfect for ketogenic diets and low-carb lifestyles.',
    price: '36.99',
    stock_quantity: 55,
    images: ['https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'MCT Oil Powder', 'Avocado Oil Powder', 'Pink Himalayan Salt', 'Sunflower Lecithin'],
    details: 'Stay in ketosis while building muscle with EggyPro Keto Friendly. This specialized formula contains less than 1g of carbs per serving while delivering 25g of complete protein. Enhanced with MCT oil powder and avocado oil powder to support ketone production and provide healthy fats. A pinch of pink Himalayan salt helps maintain electrolyte balance. Perfect for keto dieters, low-carb enthusiasts, and anyone seeking ultra-pure protein nutrition.'
  },
  {
    name: 'EggyPro Digestive Support',
    slug: 'eggypro-digestive-support',
    description: 'Gentle protein formula with digestive enzymes and probiotics for sensitive stomachs.',
    price: '39.99',
    stock_quantity: 45,
    images: ['https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Digestive Enzyme Blend', 'Probiotic Blend (5 Billion CFU)', 'Ginger Root Extract', 'Sunflower Lecithin'],
    details: 'Enjoy protein without digestive discomfort with EggyPro Digestive Support. This gentle formula includes a comprehensive digestive enzyme blend to help break down proteins efficiently, plus 5 billion CFU of beneficial probiotics to support gut health. Ginger root extract soothes the digestive system naturally. With 24g of easily digestible protein, it\'s perfect for those with sensitive stomachs or anyone looking to optimize their digestive health while building muscle.'
  }
];

// Comprehensive reviews for each product
const comprehensiveReviews = [
  // EggyPro Original reviews
  {
    reviewer_name: 'Alex Thompson',
    rating: 5,
    comment: 'Absolutely love this protein! Mixes incredibly well and is truly unflavored. I can add it to anything - smoothies, oatmeal, even baking. The quality is outstanding and I\'ve noticed great muscle recovery since switching to EggyPro.',
    image_url: 'https://i.pravatar.cc/150?img=1',
    productSlug: 'eggypro-original'
  },
  {
    reviewer_name: 'Sarah Mitchell',
    rating: 4,
    comment: 'Great quality protein. A bit foamy if shaken too hard, but settles quickly. Results are definitely noticeable - my strength has improved significantly over the past month.',
    productSlug: 'eggypro-original'
  },
  {
    reviewer_name: 'Mike Rodriguez',
    rating: 5,
    comment: 'Been using this for 6 months now. Clean ingredients, no weird aftertaste, and my trainer noticed the difference in my muscle definition. Will definitely keep ordering!',
    video_url: 'https://example.com/video1',
    productSlug: 'eggypro-original'
  },
  {
    reviewer_name: 'Emily Chen',
    rating: 5,
    comment: 'As someone with lactose intolerance, finding a high-quality protein was challenging. EggyPro Original is perfect - no digestive issues and excellent results!',
    productSlug: 'eggypro-original'
  },

  // EggyPro Vanilla Dream reviews
  {
    reviewer_name: 'David Wilson',
    rating: 5,
    comment: 'The Vanilla Dream is amazing! Tastes like a milkshake but without the guilt. No eggy aftertaste at all, just smooth vanilla goodness. My kids even ask for it!',
    image_url: 'https://i.pravatar.cc/150?img=2',
    productSlug: 'eggypro-vanilla-dream'
  },
  {
    reviewer_name: 'Lisa Johnson',
    rating: 4,
    comment: 'Really enjoying this flavor. Not too sweet, which I appreciate. Mixes well with almond milk and makes my morning routine so much better.',
    productSlug: 'eggypro-vanilla-dream'
  },
  {
    reviewer_name: 'Carlos Martinez',
    rating: 5,
    comment: 'Perfect for my post-workout shakes. The vanilla flavor is natural and not artificial tasting. Great protein content and I love that it\'s naturally sweetened.',
    productSlug: 'eggypro-vanilla-dream'
  },

  // EggyPro Chocolate Bliss reviews
  {
    reviewer_name: 'Amanda Foster',
    rating: 5,
    comment: 'This chocolate flavor is incredible! It actually tastes like dessert. I use it in my morning smoothies and sometimes just mix it with water when I\'m craving chocolate.',
    image_url: 'https://i.pravatar.cc/150?img=3',
    productSlug: 'eggypro-chocolate-bliss'
  },
  {
    reviewer_name: 'Ryan O\'Connor',
    rating: 4,
    comment: 'Rich chocolate taste without being overpowering. Great for baking protein muffins too. The texture is smooth and it doesn\'t leave any chalky residue.',
    productSlug: 'eggypro-chocolate-bliss'
  },
  {
    reviewer_name: 'Jessica Park',
    rating: 5,
    comment: 'Finally found a chocolate protein that doesn\'t taste artificial! The cocoa flavor is rich and satisfying. Perfect for my afternoon protein fix.',
    productSlug: 'eggypro-chocolate-bliss'
  },

  // EggyPro Strawberry Cream reviews
  {
    reviewer_name: 'Tom Bradley',
    rating: 4,
    comment: 'Love the strawberry flavor - it\'s fresh and not too sweet. Reminds me of strawberry milk from childhood but with all the protein benefits.',
    productSlug: 'eggypro-strawberry-cream'
  },
  {
    reviewer_name: 'Nicole Davis',
    rating: 5,
    comment: 'This is my favorite flavor! The strawberry taste is so natural and creamy. I mix it with Greek yogurt for the perfect post-workout snack.',
    image_url: 'https://i.pravatar.cc/150?img=4',
    productSlug: 'eggypro-strawberry-cream'
  },

  // EggyPro Performance Plus reviews
  {
    reviewer_name: 'Jake Morrison',
    rating: 5,
    comment: 'This is the real deal for serious training. The added BCAAs and creatine make a noticeable difference in my workouts. Recovery time has improved significantly.',
    productSlug: 'eggypro-performance-plus'
  },
  {
    reviewer_name: 'Maria Gonzalez',
    rating: 5,
    comment: 'Perfect for my powerlifting training. The combination of protein, BCAAs, and creatine in one product saves me money and time. Highly recommend for athletes!',
    video_url: 'https://example.com/video2',
    productSlug: 'eggypro-performance-plus'
  },
  {
    reviewer_name: 'Chris Taylor',
    rating: 4,
    comment: 'Great all-in-one formula. I\'ve noticed better endurance and faster recovery since starting this. The unflavored version mixes well with anything.',
    productSlug: 'eggypro-performance-plus'
  },

  // EggyPro Lean & Clean reviews
  {
    reviewer_name: 'Ashley Williams',
    rating: 5,
    comment: 'Perfect for my cutting phase! The added fat-burning ingredients really seem to help with my body composition goals. Great protein quality too.',
    image_url: 'https://i.pravatar.cc/150?img=5',
    productSlug: 'eggypro-lean-clean'
  },
  {
    reviewer_name: 'Kevin Lee',
    rating: 4,
    comment: 'Good product for lean muscle building. I like that it has natural ingredients for fat burning rather than harsh stimulants.',
    productSlug: 'eggypro-lean-clean'
  },

  // EggyPro Recovery Formula reviews
  {
    reviewer_name: 'Rachel Green',
    rating: 5,
    comment: 'Amazing for post-workout recovery! The electrolytes really help with hydration and I\'ve noticed less muscle soreness since using this.',
    productSlug: 'eggypro-recovery-formula'
  },
  {
    reviewer_name: 'Mark Thompson',
    rating: 5,
    comment: 'The turmeric and cherry extracts make a real difference. My joints feel better and recovery is much faster. Great investment for serious athletes.',
    image_url: 'https://i.pravatar.cc/150?img=6',
    productSlug: 'eggypro-recovery-formula'
  },

  // EggyPro Morning Boost reviews
  {
    reviewer_name: 'Jennifer Adams',
    rating: 5,
    comment: 'Perfect morning protein! The natural caffeine gives me energy without jitters and the protein keeps me full until lunch. Replaced my coffee and breakfast!',
    productSlug: 'eggypro-morning-boost'
  },
  {
    reviewer_name: 'Steve Miller',
    rating: 4,
    comment: 'Great way to start the day. The vanilla flavor is pleasant and the energy boost is smooth and sustained. Much better than my old pre-workout.',
    productSlug: 'eggypro-morning-boost'
  },

  // EggyPro Nighttime Recovery reviews
  {
    reviewer_name: 'Laura Wilson',
    rating: 5,
    comment: 'This has improved my sleep quality significantly! The magnesium and chamomile really help me relax, and I wake up feeling more recovered.',
    image_url: 'https://i.pravatar.cc/150?img=7',
    productSlug: 'eggypro-nighttime-recovery'
  },
  {
    reviewer_name: 'Robert Kim',
    rating: 4,
    comment: 'Great for overnight recovery. I take it before bed and wake up with less muscle stiffness. The casein blend provides sustained protein release.',
    productSlug: 'eggypro-nighttime-recovery'
  },

  // EggyPro Plant Fusion reviews
  {
    reviewer_name: 'Samantha Brown',
    rating: 4,
    comment: 'Interesting blend of proteins. I like having both animal and plant sources. Digestibility is excellent and the amino acid profile is complete.',
    productSlug: 'eggypro-plant-fusion'
  },
  {
    reviewer_name: 'Daniel Garcia',
    rating: 5,
    comment: 'Best of both worlds! The plant proteins add fiber and minerals while the egg protein provides superior bioavailability. Great innovation!',
    productSlug: 'eggypro-plant-fusion'
  },

  // EggyPro Keto Friendly reviews
  {
    reviewer_name: 'Michelle Turner',
    rating: 5,
    comment: 'Perfect for my keto lifestyle! Zero carbs and the MCT oil helps maintain ketosis. Finally a protein that fits my macros perfectly.',
    image_url: 'https://i.pravatar.cc/150?img=8',
    productSlug: 'eggypro-keto-friendly'
  },
  {
    reviewer_name: 'Andrew Clark',
    rating: 5,
    comment: 'Excellent for low-carb diets. The added fats help with satiety and the protein quality is outstanding. Highly recommend for keto dieters!',
    productSlug: 'eggypro-keto-friendly'
  },

  // EggyPro Digestive Support reviews
  {
    reviewer_name: 'Patricia Moore',
    rating: 5,
    comment: 'Finally a protein that doesn\'t upset my stomach! The digestive enzymes and probiotics make all the difference. No bloating or discomfort.',
    productSlug: 'eggypro-digestive-support'
  },
  {
    reviewer_name: 'James White',
    rating: 4,
    comment: 'Great for sensitive stomachs. The ginger extract is a nice touch and really helps with digestion. Quality protein without the digestive issues.',
    image_url: 'https://i.pravatar.cc/150?img=9',
    productSlug: 'eggypro-digestive-support'
  }
];

async function comprehensiveSeed() {
  try {
    console.log('Starting comprehensive database seeding...');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await db.delete(reviews);
    await db.delete(products);
    
    // Insert comprehensive product catalog
    console.log('Inserting comprehensive product catalog...');
    const insertedProducts = await db.insert(products).values(comprehensiveProducts).returning();
    console.log(`Inserted ${insertedProducts.length} products`);
    
    // Insert comprehensive reviews with proper product IDs
    console.log('Inserting comprehensive reviews...');
    const seededReviews = comprehensiveReviews.map(review => {
      const product = insertedProducts.find(p => p.slug === review.productSlug);
      return {
        product_id: product?.id || 1,
        reviewer_name: review.reviewer_name,
        reviewer_image_url: review.image_url,
        rating: review.rating,
        comment: review.comment,
        image_url: review.image_url,
        video_url: review.video_url,
      };
    });
    
    const insertedReviews = await db.insert(reviews).values(seededReviews).returning();
    console.log(`Inserted ${insertedReviews.length} reviews`);
    
    console.log('Comprehensive database seeding completed successfully!');
    console.log('\n=== PRODUCT CATALOG SUMMARY ===');
    insertedProducts.forEach(product => {
      const productReviews = insertedReviews.filter(r => r.product_id === product.id);
      console.log(`📦 ${product.name}`);
      console.log(`   💰 $${product.price} | 📦 Stock: ${product.stock_quantity} | ⭐ Reviews: ${productReviews.length}`);
      console.log(`   🔗 /product/${product.slug}`);
      console.log('');
    });
    
    await client.end();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run the comprehensive seed function
comprehensiveSeed()
  .then(() => {
    console.log('🎉 Comprehensive seeding finished successfully!');
    console.log('🚀 Your ecommerce store now has 12 products with 30+ reviews!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Comprehensive seeding failed:', error);
    process.exit(1);
  });