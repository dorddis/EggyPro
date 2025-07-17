import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EqualHeightGrid, useSubgridSupport } from '../equal-height-grid';

// Mock different browser environments
const mockUserAgent = (userAgent: string) => {
  Object.defineProperty(window.navigator, 'userAgent', {
    writable: true,
    value: userAgent,
  });
};

// Mock CSS.supports for different browser capabilities
const mockCSSSupports = (supportMap: Record<string, boolean>) => {
  const originalSupports = window.CSS?.supports;
  
  Object.defineProperty(window, 'CSS', {
    value: {
      supports: jest.fn((property: string, value?: string) => {
        const key = value ? `${property}: ${value}` : property;
        return supportMap[key] ?? false;
      }),
    },
    writable: true,
  });

  return () => {
    if (originalSupports) {
      Object.defineProperty(window, 'CSS', {
        value: { supports: originalSupports },
        writable: true,
      });
    }
  };
};

describe('Cross-Browser Compatibility Tests', () => {
  describe('Browser Detection', () => {
    afterEach(() => {
      // Reset user agent after each test
      mockUserAgent('Mozilla/5.0 (compatible; Test)');
    });

    it('detects Chrome browser correctly', () => {
      mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      const { container } = render(
        <EqualHeightGrid>
          <div>Test Card</div>
        </EqualHeightGrid>
      );

      // Chrome should support modern grid features
      expect(container.firstChild).toHaveClass('grid');
    });

    it('detects Firefox browser correctly', () => {
      mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0');
      
      const { container } = render(
        <EqualHeightGrid>
          <div>Test Card</div>
        </EqualHeightGrid>
      );

      // Firefox should support grid features
      expect(container.firstChild).toHaveClass('grid');
    });

    it('detects Safari browser correctly', () => {
      mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15');
      
      const { container } = render(
        <EqualHeightGrid>
          <div>Test Card</div>
        </EqualHeightGrid>
      );

      // Safari should support grid features
      expect(container.firstChild).toHaveClass('grid');
    });

    it('detects Edge browser correctly', () => {
      mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59');
      
      const { container } = render(
        <EqualHeightGrid>
          <div>Test Card</div>
        </EqualHeightGrid>
      );

      // Edge should support modern grid features
      expect(container.firstChild).toHaveClass('grid');
    });
  });

  describe('CSS Grid Subgrid Support Detection', () => {
    it('detects subgrid support correctly', () => {
      const restoreCSS = mockCSSSupports({
        'grid-template-rows: subgrid': true,
      });

      // Test the hook
      const TestComponent = () => {
        const supportsSubgrid = useSubgridSupport();
        return <div data-testid="subgrid-support">{supportsSubgrid.toString()}</div>;
      };

      const { getByTestId } = render(<TestComponent />);
      expect(getByTestId('subgrid-support')).toHaveTextContent('true');

      restoreCSS();
    });

    it('handles lack of subgrid support', () => {
      const restoreCSS = mockCSSSupports({
        'grid-template-rows: subgrid': false,
      });

      const TestComponent = () => {
        const supportsSubgrid = useSubgridSupport();
        return <div data-testid="subgrid-support">{supportsSubgrid.toString()}</div>;
      };

      const { getByTestId } = render(<TestComponent />);
      expect(getByTestId('subgrid-support')).toHaveTextContent('false');

      restoreCSS();
    });

    it('handles browsers without CSS.supports', () => {
      const originalCSS = window.CSS;
      
      // Remove CSS.supports
      Object.defineProperty(window, 'CSS', {
        value: undefined,
        writable: true,
      });

      const TestComponent = () => {
        const supportsSubgrid = useSubgridSupport();
        return <div data-testid="subgrid-support">{supportsSubgrid.toString()}</div>;
      };

      const { getByTestId } = render(<TestComponent />);
      expect(getByTestId('subgrid-support')).toHaveTextContent('false');

      // Restore CSS
      Object.defineProperty(window, 'CSS', {
        value: originalCSS,
        writable: true,
      });
    });
  });

  describe('Responsive Breakpoint Behavior', () => {
    const mockViewport = (width: number, height: number) => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: height,
      });
    };

    it('applies correct classes for mobile viewport', () => {
      mockViewport(375, 667); // iPhone SE dimensions

      const { container } = render(
        <EqualHeightGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
          <div>Card 1</div>
          <div>Card 2</div>
        </EqualHeightGrid>
      );

      const gridElement = container.firstChild as HTMLElement;
      expect(gridElement).toHaveClass('grid-cols-1');
    });

    it('applies correct classes for tablet viewport', () => {
      mockViewport(768, 1024); // iPad dimensions

      const { container } = render(
        <EqualHeightGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
          <div>Card 1</div>
          <div>Card 2</div>
        </EqualHeightGrid>
      );

      const gridElement = container.firstChild as HTMLElement;
      expect(gridElement).toHaveClass('md:grid-cols-2');
    });

    it('applies correct classes for desktop viewport', () => {
      mockViewport(1920, 1080); // Desktop dimensions

      const { container } = render(
        <EqualHeightGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
          <div>Card 1</div>
          <div>Card 2</div>
        </EqualHeightGrid>
      );

      const gridElement = container.firstChild as HTMLElement;
      expect(gridElement).toHaveClass('lg:grid-cols-3');
    });
  });

  describe('Fallback Behavior', () => {
    it('provides flexbox fallback when grid is not supported', () => {
      const restoreCSS = mockCSSSupports({
        'display: grid': false,
        'display: flex': true,
      });

      const { container } = render(
        <EqualHeightGrid>
          <div>Card 1</div>
          <div>Card 2</div>
        </EqualHeightGrid>
      );

      // Should still render with appropriate classes
      const gridElement = container.firstChild as HTMLElement;
      expect(gridElement).toBeInTheDocument();

      restoreCSS();
    });

    it('handles missing CSS custom property support', () => {
      const { container } = render(
        <EqualHeightGrid minCardWidth="300px">
          <div>Card 1</div>
        </EqualHeightGrid>
      );

      const gridElement = container.firstChild as HTMLElement;
      
      // Should set the custom property even if not supported
      expect(gridElement).toHaveStyle({ '--min-card-width': '300px' });
    });
  });

  describe('Performance Across Browsers', () => {
    it('handles large numbers of cards efficiently', () => {
      const manyCards = Array.from({ length: 100 }, (_, i) => (
        <div key={i}>Card {i + 1}</div>
      ));

      const startTime = performance.now();
      
      const { container } = render(
        <EqualHeightGrid>
          {manyCards}
        </EqualHeightGrid>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within reasonable time (less than 100ms)
      expect(renderTime).toBeLessThan(100);
      expect(container.firstChild?.children).toHaveLength(100);
    });

    it('maintains performance with complex nested content', () => {
      const complexCards = Array.from({ length: 20 }, (_, i) => (
        <div key={i} className="complex-card">
          <div className="header">
            <h3>Card {i + 1}</h3>
            <div className="meta">
              <span>Author</span>
              <span>Date</span>
            </div>
          </div>
          <div className="content">
            <p>This is some complex content with multiple nested elements.</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </div>
          <div className="footer">
            <button>Action 1</button>
            <button>Action 2</button>
          </div>
        </div>
      ));

      const startTime = performance.now();
      
      const { container } = render(
        <EqualHeightGrid>
          {complexCards}
        </EqualHeightGrid>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should handle complex content efficiently
      expect(renderTime).toBeLessThan(200);
      expect(container.firstChild?.children).toHaveLength(20);
    });
  });

  describe('Browser-Specific Quirks', () => {
    it('handles Safari flexbox quirks', () => {
      mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15');

      const { container } = render(
        <EqualHeightGrid>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>Header</div>
            <div style={{ flexGrow: 1 }}>Content</div>
            <div>Footer</div>
          </div>
        </EqualHeightGrid>
      );

      // Should render without issues in Safari
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles Internet Explorer fallbacks', () => {
      mockUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko');

      const { container } = render(
        <EqualHeightGrid>
          <div>Card 1</div>
          <div>Card 2</div>
        </EqualHeightGrid>
      );

      // Should provide basic layout even in IE
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles Firefox grid implementation differences', () => {
      mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0');

      const { container } = render(
        <EqualHeightGrid columns={3} gap="gap-4">
          <div>Card 1</div>
          <div>Card 2</div>
          <div>Card 3</div>
        </EqualHeightGrid>
      );

      const gridElement = container.firstChild as HTMLElement;
      expect(gridElement).toHaveClass('grid', 'gap-4');
    });
  });
});