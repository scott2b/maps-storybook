import { describe, it, expect } from 'vitest';
import { cardStyles, getCardCSS } from './card';
import { colors } from '../tokens/colors';

describe('cardStyles', () => {
  describe('base styles', () => {
    it('should have correct base styles', () => {
      expect(cardStyles.base).toEqual({
        backgroundColor: colors.surface,
        borderRadius: '0.5rem',
        padding: '1.5rem',
        transition: 'all 0.2s ease',
        color: colors.text,
      });
    });

    it('should use design tokens for colors', () => {
      expect(cardStyles.base.backgroundColor).toBe('#020617');
      expect(cardStyles.base.color).toBe('#e5e7eb');
    });
  });

  describe('variant styles', () => {
    it('should have default variant with no border or shadow', () => {
      expect(cardStyles.variants.default).toEqual({
        border: 'none',
        boxShadow: 'none',
      });
    });

    it('should have elevated variant with shadow', () => {
      expect(cardStyles.variants.elevated).toEqual({
        border: 'none',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      });
    });

    it('should have outlined variant with border', () => {
      expect(cardStyles.variants.outlined).toEqual({
        border: `1px solid ${colors.text}20`,
        boxShadow: 'none',
      });
    });
  });

  describe('clickable styles', () => {
    it('should have cursor pointer', () => {
      expect(cardStyles.clickable.cursor).toBe('pointer');
    });

    it('should have hover transform and shadow', () => {
      expect(cardStyles.clickable[':hover']).toEqual({
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      });
    });
  });

  describe('title styles', () => {
    it('should have correct typography', () => {
      expect(cardStyles.title).toEqual({
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '0.5rem',
        color: colors.text,
      });
    });
  });

  describe('description styles', () => {
    it('should have correct typography and opacity', () => {
      expect(cardStyles.description).toEqual({
        fontSize: '0.875rem',
        color: colors.text,
        opacity: 0.8,
        lineHeight: '1.5',
      });
    });
  });
});

describe('getCardCSS', () => {
  describe('default variant', () => {
    it('should generate CSS for default non-clickable card', () => {
      const css = getCardCSS('default', false);
      expect(css).toContain('backgroundColor: #020617');
      expect(css).toContain('borderRadius: 0.5rem');
      expect(css).toContain('padding: 1.5rem');
      expect(css).toContain('transition: all 0.2s ease');
      expect(css).toContain('color: #e5e7eb');
      expect(css).toContain('border: none');
      expect(css).toContain('boxShadow: none');
      expect(css).not.toContain('cursor');
    });

    it('should use default variant when no variant specified', () => {
      const css = getCardCSS();
      expect(css).toContain('border: none');
      expect(css).toContain('boxShadow: none');
    });
  });

  describe('elevated variant', () => {
    it('should generate CSS for elevated card', () => {
      const css = getCardCSS('elevated', false);
      expect(css).toContain('backgroundColor: #020617');
      expect(css).toContain('border: none');
      expect(css).toContain(
        'boxShadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
      );
    });
  });

  describe('outlined variant', () => {
    it('should generate CSS for outlined card', () => {
      const css = getCardCSS('outlined', false);
      expect(css).toContain('backgroundColor: #020617');
      expect(css).toContain('border: 1px solid #e5e7eb20');
      expect(css).toContain('boxShadow: none');
    });
  });

  describe('clickable cards', () => {
    it('should include cursor pointer for clickable cards', () => {
      const css = getCardCSS('default', true);
      expect(css).toContain('cursor: pointer');
    });

    it('should include hover styles for clickable cards', () => {
      const css = getCardCSS('elevated', true);
      expect(css).toContain('cursor: pointer');
      // Note: :hover is a nested property, so it appears as a key
      expect(css).toContain(':hover');
    });
  });

  describe('CSS format', () => {
    it('should format properties as CSS key-value pairs', () => {
      const css = getCardCSS();
      // Check format: "key: value;"
      expect(css).toMatch(/\w+:\s*.+?;/);
    });

    it('should join multiple properties with spaces', () => {
      const css = getCardCSS();
      const properties = css.split(';').filter(Boolean);
      expect(properties.length).toBeGreaterThan(5); // base + variant properties
    });
  });
});
