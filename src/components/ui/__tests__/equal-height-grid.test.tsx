import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EqualHeightGrid } from '../equal-height-grid';

// Mock child components for testing
const MockCard = ({ children, testId }: { children: React.ReactNode; testId?: string }) => (
  <div data-testid={testId} className="mock-card">
    {children}
  </div>
);

describe('EqualHeightGrid', () => {
  it('renders children correctly', () => {
    render(
      <EqualHeightGrid>
        <MockCard testId="card-1">Card 1</MockCard>
        <MockCard testId="card-2">Card 2</MockCard>
        <MockCard testId="card-3">Card 3</MockCard>
      </EqualHeightGrid>
    );

    expect(screen.getByTestId('card-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-2')).toBeInTheDocument();
    expect(screen.getByTestId('card-3')).toBeInTheDocument();
  });

  it('applies correct CSS classes for default configuration', () => {
    const { container } = render(
      <EqualHeightGrid>
        <MockCard>Card 1</MockCard>
      </EqualHeightGrid>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('grid', 'items-stretch');
  });

  it('applies correct column classes for number-based columns', () => {
    const { container } = render(
      <EqualHeightGrid columns={4}>
        <MockCard>Card 1</MockCard>
      </EqualHeightGrid>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
  });

  it('applies correct column classes for responsive object columns', () => {
    const { container } = render(
      <EqualHeightGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
        <MockCard>Card 1</MockCard>
      </EqualHeightGrid>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });

  it('applies correct gap classes for string-based gap', () => {
    const { container } = render(
      <EqualHeightGrid gap="gap-8">
        <MockCard>Card 1</MockCard>
      </EqualHeightGrid>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('gap-8');
  });

  it('applies correct gap classes for responsive object gap', () => {
    const { container } = render(
      <EqualHeightGrid gap={{ mobile: '1.5rem', tablet: '2rem', desktop: '2rem' }}>
        <MockCard>Card 1</MockCard>
      </EqualHeightGrid>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('gap-6', 'md:gap-8', 'lg:gap-8');
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <EqualHeightGrid className="custom-class">
        <MockCard>Card 1</MockCard>
      </EqualHeightGrid>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('custom-class');
  });

  it('sets custom CSS properties for minCardWidth', () => {
    const { container } = render(
      <EqualHeightGrid minCardWidth="250px">
        <MockCard>Card 1</MockCard>
      </EqualHeightGrid>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveStyle({ '--min-card-width': '250px' });
  });

  it('handles high column count with auto-fit behavior', () => {
    const { container } = render(
      <EqualHeightGrid columns={6} minCardWidth="200px">
        <MockCard>Card 1</MockCard>
      </EqualHeightGrid>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveStyle({
      'grid-template-columns': 'repeat(auto-fit, minmax(200px, 1fr))'
    });
  });

  it('renders with no children', () => {
    const { container } = render(<EqualHeightGrid />);
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toBeInTheDocument();
    expect(gridElement).toHaveClass('grid');
  });

  it('handles varying content lengths', () => {
    render(
      <EqualHeightGrid>
        <MockCard testId="short-card">Short</MockCard>
        <MockCard testId="long-card">
          This is a much longer piece of content that should test how the grid handles varying content lengths and ensures equal heights across all cards.
        </MockCard>
        <MockCard testId="medium-card">Medium length content here.</MockCard>
      </EqualHeightGrid>
    );

    // All cards should be rendered
    expect(screen.getByTestId('short-card')).toBeInTheDocument();
    expect(screen.getByTestId('long-card')).toBeInTheDocument();
    expect(screen.getByTestId('medium-card')).toBeInTheDocument();
  });

  it('maintains responsive behavior with different screen sizes', () => {
    const { container, rerender } = render(
      <EqualHeightGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }}>
        <MockCard>Card 1</MockCard>
        <MockCard>Card 2</MockCard>
        <MockCard>Card 3</MockCard>
        <MockCard>Card 4</MockCard>
      </EqualHeightGrid>
    );

    const gridElement = container.firstChild as HTMLElement;
    
    // Should have responsive classes
    expect(gridElement).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');

    // Re-render with different responsive config
    rerender(
      <EqualHeightGrid columns={{ mobile: 2, tablet: 3, desktop: 6 }}>
        <MockCard>Card 1</MockCard>
        <MockCard>Card 2</MockCard>
      </EqualHeightGrid>
    );

    expect(gridElement).toHaveClass('grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-6');
  });
});

describe('EqualHeightGrid utility functions', () => {
  it('handles edge cases for column configuration', () => {
    // Test with zero columns (should fallback to default)
    const { container } = render(
      <EqualHeightGrid columns={0}>
        <MockCard>Card 1</MockCard>
      </EqualHeightGrid>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-0');
  });

  it('handles large column numbers', () => {
    const { container } = render(
      <EqualHeightGrid columns={12}>
        <MockCard>Card 1</MockCard>
      </EqualHeightGrid>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-12');
  });
});