/**
 * Card component props - shared across all framework implementations
 */
export interface CardProps {
  /**
   * Card title
   */
  title?: string;

  /**
   * Card description/body content
   */
  description?: string;

  /**
   * Card variant
   */
  variant?: 'default' | 'elevated' | 'outlined';

  /**
   * Whether the card is clickable
   */
  clickable?: boolean;
}

/**
 * Card variant styles
 */
export const CARD_VARIANTS = {
  default: 'default',
  elevated: 'elevated',
  outlined: 'outlined',
} as const;

export type CardVariant = keyof typeof CARD_VARIANTS;
