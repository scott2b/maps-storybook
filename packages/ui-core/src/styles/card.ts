import { colors } from '../tokens/colors';

/**
 * Core card CSS - can be used as CSS-in-JS or converted to CSS classes
 */
export const cardStyles = {
  base: {
    backgroundColor: colors.surface,
    borderRadius: '0.5rem',
    padding: '1.5rem',
    transition: 'all 0.2s ease',
    color: colors.text,
  },

  variants: {
    default: {
      border: 'none',
      boxShadow: 'none',
    },
    elevated: {
      border: 'none',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    },
    outlined: {
      border: `1px solid ${colors.text}20`,
      boxShadow: 'none',
    },
  },

  clickable: {
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    },
  },

  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: colors.text,
  },

  description: {
    fontSize: '0.875rem',
    color: colors.text,
    opacity: 0.8,
    lineHeight: '1.5',
  },
};

/**
 * Generate CSS string from card styles
 */
export function getCardCSS(
  variant: 'default' | 'elevated' | 'outlined' = 'default',
  clickable = false
): string {
  const base = cardStyles.base;
  const variantStyles = cardStyles.variants[variant];
  const click = clickable ? cardStyles.clickable : {};

  return Object.entries({ ...base, ...variantStyles, ...click })
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
}
