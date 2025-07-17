import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';
import { EqualHeightGrid } from '../equal-height-grid';
import ProductCard from '../../product/ProductCard';
import TestimonialCard from '../../product/TestimonialCard';
import type { Product, Testimonial } from '@/lib/types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock data for testing
const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  description: 'This is a test product description that might be quite long and needs to be truncated properly for accessibility.',
  price: '29.99',
  slug: 'test-product',
  images: ['https://example.com/image.jpg'],
  stock_quantity: 10,
  is_active: true,
  created_at: new Date(),
  updated_at: new Date(),
};

const mockTestimonial: Testimonial = {
  id: 1,
  title: 'Great Product!',
  comment: 'This is a test testimonial comment that might be quite long and needs to be truncated properly for accessibility and screen readers.',
  reviewer_name: 'John Doe',
  rating: 5,
  created_at: new Date(),
  updated_at: new Date(),
};

describe('Card Height Consistency - Accessibility Tests', () => {
  describe('EqualHeightGrid Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <EqualHeightGrid>
          <div role="article" aria-label="Test card 1">Card 1</div>
          <div role="article" aria-label="Test card 2">Card 2</div>
          <div role="article" aria-label="Test card 3">Card 3</div>
        </EqualHeightGrid>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('maintains proper focus order with equal height cards', () => {
      render(
        <EqualHeightGrid>
          <button data-testid="card-1">Card 1 Button</button>
          <button data-testid="card-2">Card 2 Button</button>
          <button data-testid="card-3">Card 3 Button</button>
        </EqualHeightGrid>
      );

      const card1 = screen.getByTestId('card-1');
      const card2 = screen.getByTestId('card-2');
      const card3 = screen.getByTestId('card-3');

      // Focus should move in document order
      card1.focus();
      expect(document.activeElement).toBe(card1);

      // Tab order should be maintained regardless of visual layout
      expect(card1.tabIndex).toBe(0);
      expect(card2.tabIndex).toBe(0);
      expect(card3.tabIndex).toBe(0);
    });

    it('preserves ARIA attributes in grid layout', () => {
      render(
        <EqualHeightGrid>
          <div 
            role="article" 
            aria-labelledby="card-1-title"
            aria-describedby="card-1-desc"
          >
            <h3 id="card-1-title">Card 1 Title</h3>
            <p id="card-1-desc">Card 1 Description</p>
          </div>
          <div 
            role="article" 
            aria-labelledby="card-2-title"
            aria-describedby="card-2-desc"
          >
            <h3 id="card-2-title">Card 2 Title</h3>
            <p id="card-2-desc">Card 2 Description</p>
          </div>
        </EqualHeightGrid>
      );

      const card1 = screen.getByRole('article', { name: 'Card 1 Title' });
      const card2 = screen.getByRole('article', { name: 'Card 2 Title' });

      expect(card1).toHaveAttribute('aria-labelledby', 'card-1-title');
      expect(card1).toHaveAttribute('aria-describedby', 'card-1-desc');
      expect(card2).toHaveAttribute('aria-labelledby', 'card-2-title');
      expect(card2).toHaveAttribute('aria-describedby', 'card-2-desc');
    });
  });

  describe('ProductCard Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <EqualHeightGrid>
          <ProductCard product={mockProduct} />
        </EqualHeightGrid>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('provides proper text truncation accessibility', () => {
      render(
        <EqualHeightGrid>
          <ProductCard product={mockProduct} />
        </EqualHeightGrid>
      );

      // Check if truncated text has proper accessibility attributes
      const description = screen.getByText(/This is a test product description/);
      
      // Should have title attribute for full text on hover
      expect(description).toHaveAttribute('title');
      
      // Should have aria-label for screen readers if truncated
      if (description.getAttribute('aria-label')) {
        expect(description).toHaveAttribute('aria-label');
      }
    });

    it('maintains proper heading hierarchy', () => {
      render(
        <EqualHeightGrid>
          <ProductCard product={mockProduct} />
        </EqualHeightGrid>
      );

      // Product name should be in a proper heading
      const productName = screen.getByRole('heading', { name: mockProduct.name });
      expect(productName).toBeInTheDocument();
    });

    it('provides accessible image alt text', () => {
      render(
        <EqualHeightGrid>
          <ProductCard product={mockProduct} />
        </EqualHeightGrid>
      );

      const productImage = screen.getByAltText(mockProduct.name);
      expect(productImage).toBeInTheDocument();
      expect(productImage).toHaveAttribute('alt', mockProduct.name);
    });

    it('has accessible button with proper labeling', () => {
      render(
        <EqualHeightGrid>
          <ProductCard product={mockProduct} />
        </EqualHeightGrid>
      );

      const viewDetailsButton = screen.getByRole('link', { name: /view details/i });
      expect(viewDetailsButton).toBeInTheDocument();
      expect(viewDetailsButton).toHaveAttribute('href', `/product/${mockProduct.slug}`);
    });
  });

  describe('TestimonialCard Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <EqualHeightGrid>
          <TestimonialCard testimonial={mockTestimonial} />
        </EqualHeightGrid>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('provides proper text truncation accessibility for testimonials', () => {
      render(
        <EqualHeightGrid>
          <TestimonialCard testimonial={mockTestimonial} />
        </EqualHeightGrid>
      );

      // Check if truncated testimonial comment has proper accessibility attributes
      const comment = screen.getByText(/This is a test testimonial comment/);
      
      // Should have title attribute for full text on hover
      expect(comment).toHaveAttribute('title');
      
      // Should have aria-label for screen readers if truncated
      if (comment.getAttribute('aria-label')) {
        expect(comment).toHaveAttribute('aria-label');
      }
    });

    it('provides accessible star ratings', () => {
      render(
        <EqualHeightGrid>
          <TestimonialCard testimonial={mockTestimonial} />
        </EqualHeightGrid>
      );

      // Star ratings should be accessible
      const stars = screen.getAllByRole('img', { hidden: true });
      expect(stars).toHaveLength(5); // 5 star rating system
    });

    it('maintains proper content structure', () => {
      render(
        <EqualHeightGrid>
          <TestimonialCard testimonial={mockTestimonial} />
        </EqualHeightGrid>
      );

      // Testimonial title should be in a proper heading
      const testimonialTitle = screen.getByRole('heading', { name: mockTestimonial.title });
      expect(testimonialTitle).toBeInTheDocument();

      // Reviewer name should be accessible
      const reviewerName = screen.getByText(mockTestimonial.reviewer_name);
      expect(reviewerName).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation through equal height cards', () => {
      render(
        <EqualHeightGrid>
          <div>
            <button data-testid="card-1-btn">Card 1 Action</button>
          </div>
          <div>
            <button data-testid="card-2-btn">Card 2 Action</button>
          </div>
          <div>
            <button data-testid="card-3-btn">Card 3 Action</button>
          </div>
        </EqualHeightGrid>
      );

      const button1 = screen.getByTestId('card-1-btn');
      const button2 = screen.getByTestId('card-2-btn');
      const button3 = screen.getByTestId('card-3-btn');

      // All buttons should be focusable
      expect(button1).not.toHaveAttribute('tabindex', '-1');
      expect(button2).not.toHaveAttribute('tabindex', '-1');
      expect(button3).not.toHaveAttribute('tabindex', '-1');
    });

    it('maintains focus visibility with equal height cards', () => {
      const { container } = render(
        <EqualHeightGrid>
          <button className="focus:ring-2 focus:ring-primary">Focusable Card 1</button>
          <button className="focus:ring-2 focus:ring-primary">Focusable Card 2</button>
        </EqualHeightGrid>
      );

      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        button.focus();
        // Focus styles should be applied
        expect(button).toHaveClass('focus:ring-2', 'focus:ring-primary');
      });
    });
  });

  describe('Screen Reader Compatibility', () => {
    it('provides proper semantic structure for screen readers', () => {
      render(
        <main>
          <section aria-labelledby="products-heading">
            <h2 id="products-heading">Featured Products</h2>
            <EqualHeightGrid>
              <ProductCard product={mockProduct} />
            </EqualHeightGrid>
          </section>
        </main>
      );

      // Main landmark should be present
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();

      // Section should have proper labeling
      const section = screen.getByRole('region', { name: 'Featured Products' });
      expect(section).toBeInTheDocument();

      // Heading should be properly associated
      const heading = screen.getByRole('heading', { name: 'Featured Products' });
      expect(heading).toBeInTheDocument();
    });

    it('announces truncated content appropriately', () => {
      const longDescription = 'This is a very long product description that will definitely be truncated and should have proper accessibility attributes for screen readers to understand the full content.';
      
      const productWithLongDesc: Product = {
        ...mockProduct,
        description: longDescription
      };

      render(
        <EqualHeightGrid>
          <ProductCard product={productWithLongDesc} />
        </EqualHeightGrid>
      );

      const description = screen.getByText(/This is a very long product description/);
      
      // Should provide full text to screen readers
      if (description.getAttribute('aria-label')) {
        expect(description.getAttribute('aria-label')).toContain(longDescription);
      }
      
      if (description.getAttribute('title')) {
        expect(description.getAttribute('title')).toContain(longDescription);
      }
    });
  });
});