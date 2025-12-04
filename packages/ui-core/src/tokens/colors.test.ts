import { describe, it, expect } from 'vitest';
import { colors } from './colors';

describe('colors', () => {
  it('should export all required color tokens', () => {
    expect(colors).toHaveProperty('primary');
    expect(colors).toHaveProperty('surface');
    expect(colors).toHaveProperty('text');
  });

  describe('color values', () => {
    it('should have correct primary color', () => {
      expect(colors.primary).toBe('#0f766e');
    });

    it('should have correct surface color', () => {
      expect(colors.surface).toBe('#020617');
    });

    it('should have correct text color', () => {
      expect(colors.text).toBe('#e5e7eb');
    });
  });

  describe('color format', () => {
    it('should use hex format for all colors', () => {
      const hexPattern = /^#[0-9a-f]{6}$/i;
      expect(colors.primary).toMatch(hexPattern);
      expect(colors.surface).toMatch(hexPattern);
      expect(colors.text).toMatch(hexPattern);
    });
  });

  describe('color accessibility', () => {
    it('should have dark surface color', () => {
      // Surface should be a dark color (low hex value)
      const surfaceValue = parseInt(colors.surface.slice(1), 16);
      expect(surfaceValue).toBeLessThan(0x333333);
    });

    it('should have light text color', () => {
      // Text should be a light color (high hex value)
      const textValue = parseInt(colors.text.slice(1), 16);
      expect(textValue).toBeGreaterThan(0xcccccc);
    });
  });
});
