/**
 * Text truncation utilities for consistent card content
 * Provides functions to truncate text while maintaining accessibility
 */

export interface TruncateOptions {
  /** Maximum number of characters to display */
  maxLength?: number;
  /** Maximum number of lines to display (for line-clamp) */
  maxLines?: number;
  /** Suffix to append when text is truncated */
  suffix?: string;
  /** Whether to break at word boundaries */
  wordBoundary?: boolean;
  /** Whether to preserve HTML tags */
  preserveHtml?: boolean;
}

/**
 * Truncates text to a specified character limit
 * @param text - The text to truncate
 * @param options - Truncation options
 * @returns Truncated text with suffix if needed
 */
export function truncateText(text: string, options: TruncateOptions = {}): string {
  const {
    maxLength = 150,
    suffix = '...',
    wordBoundary = true,
    preserveHtml = false
  } = options;

  if (!text || text.length <= maxLength) {
    return text;
  }

  // Remove HTML tags if not preserving them
  const cleanText = preserveHtml ? text : text.replace(/<[^>]*>/g, '');
  
  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  let truncated = cleanText.substring(0, maxLength);

  if (wordBoundary) {
    // Find the last space to avoid cutting words
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 0 && lastSpace > maxLength * 0.8) {
      truncated = truncated.substring(0, lastSpace);
    }
  }

  return truncated + suffix;
}

/**
 * Truncates text to a specified number of lines
 * Returns CSS classes for line-clamp implementation
 * @param maxLines - Maximum number of lines to display
 * @returns CSS class string for line-clamp
 */
export function getLineClampClass(maxLines: number): string {
  const clampClasses: Record<number, string> = {
    1: 'line-clamp-1',
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
    5: 'line-clamp-5',
    6: 'line-clamp-6',
  };

  return clampClasses[maxLines] || `line-clamp-${maxLines}`;
}

/**
 * Predefined truncation presets for common card content types
 */
export const truncationPresets = {
  /** Product card description */
  productDescription: {
    maxLength: 120,
    maxLines: 3,
    wordBoundary: true,
  },
  /** Testimonial comment */
  testimonialComment: {
    maxLength: 200,
    maxLines: 4,
    wordBoundary: true,
  },
  /** Feature card description */
  featureDescription: {
    maxLength: 100,
    maxLines: 3,
    wordBoundary: true,
  },
  /** Blog post excerpt */
  blogExcerpt: {
    maxLength: 180,
    maxLines: 4,
    wordBoundary: true,
  },
  /** Card title */
  cardTitle: {
    maxLength: 60,
    maxLines: 2,
    wordBoundary: true,
    suffix: '...',
  },
} as const;

/**
 * Applies truncation preset to text
 * @param text - The text to truncate
 * @param preset - The preset to use
 * @returns Truncated text
 */
export function applyTruncationPreset(
  text: string,
  preset: keyof typeof truncationPresets
): string {
  const options = truncationPresets[preset];
  return truncateText(text, options);
}

/**
 * Generates accessible truncated text with proper ARIA attributes
 * @param text - The original text
 * @param truncatedText - The truncated version
 * @returns Object with truncated text and ARIA attributes
 */
export function createAccessibleTruncatedText(text: string, truncatedText: string) {
  const isTruncated = text.length > truncatedText.length;
  
  return {
    displayText: truncatedText,
    ariaLabel: isTruncated ? text : undefined,
    title: isTruncated ? text : undefined,
    isTruncated,
  };
}

/**
 * Hook-like function for consistent text truncation in components
 * @param text - The text to process
 * @param preset - The truncation preset to use
 * @returns Processed text with accessibility attributes
 */
export function useTruncatedText(
  text: string,
  preset: keyof typeof truncationPresets
) {
  const truncated = applyTruncationPreset(text, preset);
  return createAccessibleTruncatedText(text, truncated);
}

/**
 * Calculates optimal character limit based on container width and font size
 * @param containerWidth - Width of the container in pixels
 * @param fontSize - Font size in pixels
 * @param charactersPerLine - Average characters per line (default: 50)
 * @returns Recommended character limit
 */
export function calculateOptimalCharacterLimit(
  containerWidth: number,
  fontSize: number = 16,
  charactersPerLine: number = 50
): number {
  // Rough calculation: container width / (font size * 0.6) gives approximate characters per line
  const estimatedCharsPerLine = Math.floor(containerWidth / (fontSize * 0.6));
  const actualCharsPerLine = Math.min(estimatedCharsPerLine, charactersPerLine);
  
  // Return 3 lines worth of characters as a reasonable limit
  return actualCharsPerLine * 3;
}