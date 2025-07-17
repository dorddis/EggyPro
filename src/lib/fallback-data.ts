// Fallback data for when database connections fail

export const mockProducts = [
  {
    id: 1,
    name: 'EggyPro Original',
    slug: 'eggypro-original',
    description: 'The purest form of egg white protein, perfect for muscle recovery and growth. Unflavored to mix with anything.',
    price: '29.99',
    stock_quantity: 150,
    images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Sunflower Lecithin (for mixability)'],
    details: 'EggyPro Original is made from 100% pure egg whites, carefully processed to retain maximum nutritional value. Each serving provides 25g of high-quality protein, essential amino acids, and is virtually fat-free and carb-free. Our eggs are sourced from cage-free farms committed to animal welfare.',
    is_active: true,
    created_at: '2025-07-17T12:03:18.987Z',
    updated_at: '2025-07-17T12:03:18.987Z'
  },
  {
    id: 2,
    name: 'EggyPro Vanilla Dream',
    slug: 'eggypro-vanilla-dream',
    description: 'Deliciously smooth vanilla flavored egg white protein. Naturally sweetened for a guilt-free treat.',
    price: '32.99',
    stock_quantity: 120,
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Natural Vanilla Flavor', 'Stevia Leaf Extract', 'Sunflower Lecithin'],
    details: 'Experience the creamy delight of EggyPro Vanilla Dream. This isn\'t just protein; it\'s a treat. We use natural vanilla flavors and sweeten it with stevia, so you can enjoy a delicious shake without any added sugars.',
    is_active: true,
    created_at: '2025-07-17T12:03:18.987Z',
    updated_at: '2025-07-17T12:03:18.987Z'
  },
  {
    id: 3,
    name: 'EggyPro Chocolate Bliss',
    slug: 'eggypro-chocolate-bliss',
    description: 'Rich chocolate flavored egg protein that tastes like dessert but fuels like a champion.',
    price: '34.99',
    stock_quantity: 95,
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Natural Cocoa Powder', 'Natural Chocolate Flavor', 'Stevia Leaf Extract'],
    details: 'Indulge in the rich, decadent taste of EggyPro Chocolate Bliss. Made with premium cocoa powder and natural chocolate flavoring, this protein powder delivers 25g of complete protein per serving.',
    is_active: true,
    created_at: '2025-07-17T12:03:18.987Z',
    updated_at: '2025-07-17T12:03:18.987Z'
  },
  {
    id: 4,
    name: 'EggyPro Performance Plus',
    slug: 'eggypro-performance-plus',
    description: 'Enhanced formula with added BCAAs and creatine for serious athletes and fitness enthusiasts.',
    price: '39.99',
    stock_quantity: 60,
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'BCAA Complex', 'Creatine Monohydrate', 'L-Glutamine'],
    details: 'Take your training to the next level with EggyPro Performance Plus. This advanced formula combines our premium egg white protein with scientifically-proven performance enhancers.',
    is_active: true,
    created_at: '2025-07-17T12:03:18.987Z',
    updated_at: '2025-07-17T12:03:18.987Z'
  },
  {
    id: 5,
    name: 'EggyPro Berry Burst',
    slug: 'eggypro-berry-burst',
    description: 'Antioxidant-rich berry flavored protein with real fruit extracts for natural sweetness.',
    price: '33.99',
    stock_quantity: 85,
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Natural Berry Flavors', 'Freeze-Dried Strawberry', 'Stevia Leaf Extract'],
    details: 'Packed with antioxidants and natural berry flavors, EggyPro Berry Burst provides clean protein with the added benefits of real fruit extracts.',
    is_active: true,
    created_at: '2025-07-17T12:03:18.987Z',
    updated_at: '2025-07-17T12:03:18.987Z'
  },
  {
    id: 6,
    name: 'EggyPro Tropical Paradise',
    slug: 'eggypro-tropical-paradise',
    description: 'Escape to the tropics with this exotic blend of pineapple, mango, and coconut flavors.',
    price: '34.99',
    stock_quantity: 75,
    images: ['https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Natural Tropical Flavors', 'Coconut Powder', 'Pineapple Extract'],
    details: 'Transport your taste buds to paradise with this tropical protein blend that makes every workout feel like a vacation.',
    is_active: true,
    created_at: '2025-07-17T12:03:18.987Z',
    updated_at: '2025-07-17T12:03:18.987Z'
  },
  {
    id: 7,
    name: 'EggyPro Mint Chocolate Chip',
    slug: 'eggypro-mint-chocolate-chip',
    description: 'Cool mint flavor with real chocolate chips for a refreshing post-workout treat.',
    price: '35.99',
    stock_quantity: 65,
    images: ['https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Natural Mint Extract', 'Dark Chocolate Chips', 'Stevia Leaf Extract'],
    details: 'Cool and refreshing mint flavor combined with rich dark chocolate chips creates the perfect post-workout indulgence.',
    is_active: true,
    created_at: '2025-07-17T12:03:18.987Z',
    updated_at: '2025-07-17T12:03:18.987Z'
  },
  {
    id: 8,
    name: 'EggyPro Cinnamon Roll',
    slug: 'eggypro-cinnamon-roll',
    description: 'Warm cinnamon spice flavor that tastes like your favorite breakfast pastry.',
    price: '33.99',
    stock_quantity: 90,
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Natural Cinnamon', 'Vanilla Extract', 'Stevia Leaf Extract'],
    details: 'Start your day right with the warm, comforting taste of cinnamon roll in a healthy protein shake.',
    is_active: true,
    created_at: '2025-07-17T12:03:18.987Z',
    updated_at: '2025-07-17T12:03:18.987Z'
  },
  {
    id: 9,
    name: 'EggyPro Cookies & Cream',
    slug: 'eggypro-cookies-cream',
    description: 'Classic cookies and cream flavor with real cookie pieces for added texture.',
    price: '36.99',
    stock_quantity: 55,
    images: ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Natural Cookie Flavor', 'Cocoa Powder', 'Cookie Pieces'],
    details: 'Indulge in the classic combination of cookies and cream while fueling your muscles with premium protein.',
    is_active: true,
    created_at: '2025-07-17T12:03:18.987Z',
    updated_at: '2025-07-17T12:03:18.987Z'
  },
  {
    id: 10,
    name: 'EggyPro Peanut Butter Cup',
    slug: 'eggypro-peanut-butter-cup',
    description: 'Rich peanut butter and chocolate combination for the ultimate protein indulgence.',
    price: '37.99',
    stock_quantity: 45,
    images: ['https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Natural Peanut Butter', 'Cocoa Powder', 'Stevia Leaf Extract'],
    details: 'The perfect marriage of creamy peanut butter and rich chocolate in a high-quality protein powder.',
    is_active: true,
    created_at: '2025-07-17T12:03:18.987Z',
    updated_at: '2025-07-17T12:03:18.987Z'
  },
  {
    id: 11,
    name: 'EggyPro Salted Caramel',
    slug: 'eggypro-salted-caramel',
    description: 'Decadent salted caramel flavor with a perfect balance of sweet and salty.',
    price: '35.99',
    stock_quantity: 70,
    images: ['https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Natural Caramel Flavor', 'Sea Salt', 'Stevia Leaf Extract'],
    details: 'Experience the luxurious taste of salted caramel while supporting your fitness goals with clean protein.',
    is_active: true,
    created_at: '2025-07-17T12:03:18.987Z',
    updated_at: '2025-07-17T12:03:18.987Z'
  },
  {
    id: 12,
    name: 'EggyPro Mocha Madness',
    slug: 'eggypro-mocha-madness',
    description: 'Coffee and chocolate blend for the perfect pre-workout energy boost.',
    price: '36.99',
    stock_quantity: 80,
    images: ['https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=600&fit=crop'],
    ingredients: ['Egg White Powder', 'Natural Coffee Extract', 'Cocoa Powder', 'Natural Caffeine'],
    details: 'Get your caffeine fix and protein boost in one delicious shake with our coffee-chocolate blend.',
    is_active: true,
    created_at: '2025-07-17T12:03:18.987Z',
    updated_at: '2025-07-17T12:03:18.987Z'
  }
];

export const mockReviews = [
  {
    id: 1,
    product_id: 1,
    reviewer_name: 'Alex Thompson',
    rating: 5,
    comment: 'Absolutely love this protein! Mixes incredibly well and is truly unflavored.',
    image_url: 'https://i.pravatar.cc/150?img=1',
    created_at: '2025-07-17T12:03:18.987Z'
  },
  {
    id: 2,
    product_id: 1,
    reviewer_name: 'Sarah Mitchell',
    rating: 4,
    comment: 'Great quality protein. Results are definitely noticeable.',
    created_at: '2025-07-17T12:03:18.987Z'
  },
  {
    id: 3,
    product_id: 2,
    reviewer_name: 'David Wilson',
    rating: 5,
    comment: 'The Vanilla Dream is amazing! Tastes like a milkshake but without the guilt.',
    created_at: '2025-07-17T12:03:18.987Z'
  },
  {
    id: 4,
    product_id: 3,
    reviewer_name: 'Emily Chen',
    rating: 5,
    comment: 'Best chocolate protein I\'ve ever tried. No chalky aftertaste!',
    created_at: '2025-07-17T12:03:18.987Z'
  },
  {
    id: 5,
    product_id: 4,
    reviewer_name: 'Mike Rodriguez',
    rating: 4,
    comment: 'Performance Plus really works. Noticed improved recovery times.',
    created_at: '2025-07-17T12:03:18.987Z'
  }
];

export const mockStats = {
  totalProducts: 12,
  totalStock: 1020,
  totalReviews: 5,
  averageRating: '4.6',
  lowStockProducts: mockProducts.filter(p => p.stock_quantity < 70),
  summary: {
    inStock: 12,
    outOfStock: 0,
    lowStock: 3
  }
};

// Helper functions for fallback data
export function findProductBySlug(slug: string) {
  return mockProducts.find(p => p.slug === slug);
}

export function getProductReviews(productId: number) {
  return mockReviews.filter(r => r.product_id === productId);
}

export function searchMockProducts(params: {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  inStock?: boolean;
}) {
  let results = [...mockProducts];

  // Text search
  if (params.query) {
    const query = params.query.toLowerCase();
    results = results.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  }

  // Price filtering
  if (params.minPrice !== undefined) {
    results = results.filter(p => parseFloat(p.price) >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    results = results.filter(p => parseFloat(p.price) <= params.maxPrice!);
  }

  // Stock filtering
  if (params.inStock === true) {
    results = results.filter(p => p.stock_quantity > 0);
  }

  // Sorting
  if (params.sort) {
    switch (params.sort) {
      case 'price-asc':
        results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-desc':
        results.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'name-asc':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'stock-desc':
        results.sort((a, b) => b.stock_quantity - a.stock_quantity);
        break;
      default:
        // Default to newest (by created_at)
        results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }

  return results;
}