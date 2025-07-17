import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EqualHeightGrid } from '../equal-height-grid';
import ProductCard from '../../product/ProductCard';
import TestimonialCard from '../../product/TestimonialCard';
import ProductGrid from '../../product/ProductGrid';
import type { Product, Testimonial } from '@/lib/types';

// Mock data for integration tests
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Short Product Name',
    description: 'Short description.',
    price: '19.99',
    slug: 'short-product',
    images: ['https://example.com/image1.jpg'],
    stock_quantity: 10,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: 'Very Long Product Name That Should Test Text Truncation',
    description: 'This is a very long product description that should definitely be truncated when displayed in a card format to ensure consistent heights across all product cards in the grid layout.',
    price: '29.99',
    slug: 'long-product',
    images: ['https://example.com/image2.jpg'],
    stock_quantity: 5,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    name: 'Medium Length Product Name',
    description: 'Medium length description that falls between short and long content.',
    price: '24.99',
    slug: 'medium-product',
    images: ['https://example.com/image3.jpg'],
    stock_quantity: 15,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    title: 'Great!',
    comment: 'Short review.',
    reviewer_name: 'John',
    rating: 5,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    title: 'Absolutely Amazing Product Experience',
    comment: 'This is an extremely detailed and comprehensive testimonial that goes into great depth about the product experience, quality, customer service, and overall satisfaction. It should test how well our text truncation works with very long testimonial content.',
    reviewer_name: 'Jane Smith-Johnson',
    rating: 5,
    image_url: 'https://example.com/testimonial.jpg',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    title: 'Good Product',
    comment: 'Medium length testimonial with reasonable amount of detail about the product.',
    reviewer_name: 'Bob Wilson',
    rating: 4,
    video_url: 'https://example.com/video.mp4',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

describe('Card Components Integration Tests', () => {
  describe('ProductCard in EqualHeightGrid', () => {
    it('maintains equal heights with varying product data', async () => {
      render(
        <EqualHeightGrid columns={3}>
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </EqualHeightGrid>
      );

      // All product cards should be rendered
      expect(screen.getByText('Short Product Name')).toBeInTheDocument();
      expect(screen.getByText('Very Long Product Name That Should Test Text Truncation')).toBeInTheDocument();
      expect(screen.getByText('Medium Length Product Name')).toBeInTheDocument();

      // All cards should have equal height classes
      const cards = screen.getAllByRole('heading').map(heading => 
        heading.closest('[class*="card-equal-height"]')
      );
      
      cards.forEach(card => {
        expect(card).toHaveClass('card-equal-height');
      });
    });

    it('handles text truncation consistently across products', () => {
      render(
        <EqualHeightGrid columns={3}>
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </EqualHeightGrid>
      );

      // Long description should have truncation attributes
      const longDescription = screen.getByText(/This is a very long product description/);
      expect(longDescription).toHaveAttribute('title');
      
      // Short description should also be present
      expect(screen.getByText('Short description.')).toBeInTheDocument();
    });

    it('maintains proper pricing display across all cards', () => {
      render(
        <EqualHeightGrid columns={3}>
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </EqualHeightGrid>
      );

      // All prices should be displayed correctly
      expect(screen.getByText('$19.99')).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText('$24.99')).toBeInTheDocument();
    });

    it('ensures all action buttons are accessible and positioned correctly', () => {
      render(
        <EqualHeightGrid columns={3}>
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </EqualHeightGrid>
      );

      // All "View Details" buttons should be present and accessible
      const viewDetailsButtons = screen.getAllByRole('link', { name: /view details/i });
      expect(viewDetailsButtons).toHaveLength(3);

      viewDetailsButtons.forEach((button, index) => {
        expect(button).toHaveAttribute('href', `/product/${mockProducts[index].slug}`);
        expect(button).toHaveClass('card-footer-auto');
      });
    });
  });

  describe('TestimonialCard in EqualHeightGrid', () => {
    it('maintains equal heights with different testimonial content types', () => {
      render(
        <EqualHeightGrid columns={2}>
          {mockTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </EqualHeightGrid>
      );

      // All testimonial cards should be rendered
      expect(screen.getByText('Great!')).toBeInTheDocument();
      expect(screen.getByText('Absolutely Amazing Product Experience')).toBeInTheDocument();
      expect(screen.getByText('Good Product')).toBeInTheDocument();

      // All cards should have equal height classes
      const cards = screen.getAllByRole('heading').map(heading => 
        heading.closest('[class*="card-equal-height"]')
      );
      
      cards.forEach(card => {
        expect(card).toHaveClass('card-equal-height');
      });
    });

    it('handles different media types (image, video, text-only)', () => {
      render(
        <EqualHeightGrid columns={2}>
          {mockTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </EqualHeightGrid>
      );

      // Image testimonial should have image
      const imageTestimonial = screen.getByAltText('Testimonial by Jane Smith-Johnson');
      expect(imageTestimonial).toBeInTheDocument();

      // Video testimonial should have video link
      const videoLink = screen.getByRole('link', { name: /watch video/i });
      expect(videoLink).toBeInTheDocument();
      expect(videoLink).toHaveAttribute('href', 'https://example.com/video.mp4');

      // Text-only testimonial should not have media
      const textOnlyCard = screen.getByText('Great!').closest('[class*="card-equal-height"]');
      expect(textOnlyCard).not.toContainHTML('<img');
      expect(textOnlyCard).not.toContainHTML('video');
    });

    it('displays star ratings consistently', () => {
      render(
        <EqualHeightGrid columns={2}>
          {mockTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </EqualHeightGrid>
      );

      // Should have star ratings for testimonials with ratings
      const starElements = screen.getAllByRole('img', { hidden: true });
      
      // Each testimonial should have 5 stars (filled or unfilled)
      // 3 testimonials × 5 stars = 15 star elements
      expect(starElements.length).toBeGreaterThanOrEqual(15);
    });

    it('truncates long testimonial comments appropriately', () => {
      render(
        <EqualHeightGrid columns={2}>
          {mockTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </EqualHeightGrid>
      );

      // Long testimonial should have truncation attributes
      const longComment = screen.getByText(/This is an extremely detailed/);
      expect(longComment).toHaveAttribute('title');
    });
  });

  describe('ProductGrid Integration', () => {
    it('renders products in EqualHeightGrid correctly', () => {
      render(
        <ProductGrid 
          products={mockProducts}
          loading={false}
          error={null}
          columns={3}
        />
      );

      // Should render all products
      expect(screen.getByText('Short Product Name')).toBeInTheDocument();
      expect(screen.getByText('Very Long Product Name That Should Test Text Truncation')).toBeInTheDocument();
      expect(screen.getByText('Medium Length Product Name')).toBeInTheDocument();

      // Should show results summary
      expect(screen.getByText('Showing 3 of 3 products')).toBeInTheDocument();
    });

    it('handles loading state with EqualHeightGrid', () => {
      render(
        <ProductGrid 
          products={[]}
          loading={true}
          error={null}
          columns={3}
        />
      );

      // Should render loading skeletons in grid
      const skeletons = screen.getAllByRole('generic');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('handles error state appropriately', () => {
      render(
        <ProductGrid 
          products={[]}
          loading={false}
          error="Failed to load products"
          columns={3}
        />
      );

      // Should show error message
      expect(screen.getByText('Unable to Load Products')).toBeInTheDocument();
      expect(screen.getByText('Failed to load products')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('handles empty products state', () => {
      render(
        <ProductGrid 
          products={[]}
          loading={false}
          error={null}
          columns={3}
        />
      );

      // Should show empty state
      expect(screen.getByText('No Products Found')).toBeInTheDocument();
      expect(screen.getByText(/Try adjusting your search criteria/)).toBeInTheDocument();
    });
  });

  describe('Homepage Feature Cards Integration', () => {
    it('renders feature cards with equal heights', () => {
      const featureCards = [
        {
          title: 'Short Feature',
          description: 'Brief description.',
        },
        {
          title: 'Very Long Feature Title That Tests Text Handling',
          description: 'This is a much longer feature description that should test how our equal height grid handles varying amounts of content across different feature cards.',
        },
        {
          title: 'Medium Feature',
          description: 'Medium length description with reasonable detail.',
        },
      ];

      render(
        <EqualHeightGrid columns={3} className="text-center">
          {featureCards.map((feature, index) => (
            <div key={index} className="card-equal-height p-6 bg-card rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </EqualHeightGrid>
      );

      // All feature cards should be rendered
      expect(screen.getByText('Short Feature')).toBeInTheDocument();
      expect(screen.getByText('Very Long Feature Title That Tests Text Handling')).toBeInTheDocument();
      expect(screen.getByText('Medium Feature')).toBeInTheDocument();

      // All cards should have equal height classes
      const cards = screen.getAllByRole('heading').map(heading => 
        heading.closest('[class*="card-equal-height"]')
      );
      
      cards.forEach(card => {
        expect(card).toHaveClass('card-equal-height');
      });
    });
  });

  describe('Dynamic Content Loading', () => {
    it('maintains equal heights when content is loaded dynamically', async () => {
      const DynamicContentTest = () => {
        const [products, setProducts] = React.useState<Product[]>([]);
        const [loading, setLoading] = React.useState(true);

        React.useEffect(() => {
          // Simulate async data loading
          setTimeout(() => {
            setProducts(mockProducts);
            setLoading(false);
          }, 100);
        }, []);

        if (loading) {
          return (
            <EqualHeightGrid columns={3}>
              <div data-testid="loading-1">Loading...</div>
              <div data-testid="loading-2">Loading...</div>
              <div data-testid="loading-3">Loading...</div>
            </EqualHeightGrid>
          );
        }

        return (
          <EqualHeightGrid columns={3}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </EqualHeightGrid>
        );
      };

      render(<DynamicContentTest />);

      // Initially should show loading
      expect(screen.getByTestId('loading-1')).toBeInTheDocument();

      // After loading, should show products
      await waitFor(() => {
        expect(screen.getByText('Short Product Name')).toBeInTheDocument();
      });

      // Should maintain equal heights after dynamic loading
      const cards = screen.getAllByRole('heading').map(heading => 
        heading.closest('[class*="card-equal-height"]')
      );
      
      cards.forEach(card => {
        expect(card).toHaveClass('card-equal-height');
      });
    });
  });

  describe('Responsive Behavior Integration', () => {
    it('maintains equal heights across different screen sizes', () => {
      const { rerender } = render(
        <EqualHeightGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </EqualHeightGrid>
      );

      // Should have responsive classes
      const gridContainer = screen.getAllByRole('heading')[0].closest('[class*="grid"]');
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');

      // Re-render with different responsive configuration
      rerender(
        <EqualHeightGrid columns={{ mobile: 2, tablet: 3, desktop: 4 }}>
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </EqualHeightGrid>
      );

      // Should update responsive classes
      expect(gridContainer).toHaveClass('grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4');
    });
  });
});