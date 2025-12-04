import { describe, it, expect } from 'vitest';
import { CARD_VARIANTS, type CardProps, type CardVariant } from './card';

describe('CardVariant type', () => {
  it('should accept valid variant values', () => {
    const variants: CardVariant[] = ['default', 'elevated', 'outlined'];
    expect(variants).toHaveLength(3);
  });
});

describe('CARD_VARIANTS', () => {
  it('should export all valid card variants', () => {
    expect(CARD_VARIANTS).toEqual({
      default: 'default',
      elevated: 'elevated',
      outlined: 'outlined',
    });
  });

  it('should have exactly 3 variants', () => {
    expect(Object.keys(CARD_VARIANTS)).toHaveLength(3);
  });

  it('should include default variant', () => {
    expect(CARD_VARIANTS.default).toBe('default');
  });

  it('should include elevated variant', () => {
    expect(CARD_VARIANTS.elevated).toBe('elevated');
  });

  it('should include outlined variant', () => {
    expect(CARD_VARIANTS.outlined).toBe('outlined');
  });
});

describe('CardProps interface', () => {
  it('should accept valid card props', () => {
    const props: CardProps = {
      title: 'Test Card',
      description: 'Test description',
      variant: 'elevated',
      clickable: true,
    };

    expect(props.title).toBe('Test Card');
    expect(props.description).toBe('Test description');
    expect(props.variant).toBe('elevated');
    expect(props.clickable).toBe(true);
  });

  it('should allow optional properties to be undefined', () => {
    const props: CardProps = {};

    expect(props.title).toBeUndefined();
    expect(props.description).toBeUndefined();
    expect(props.variant).toBeUndefined();
    expect(props.clickable).toBeUndefined();
  });

  it('should allow partial props', () => {
    const props: CardProps = {
      title: 'Only Title',
    };

    expect(props.title).toBe('Only Title');
    expect(props.description).toBeUndefined();
  });

  it('should enforce variant type safety', () => {
    const validProps: CardProps = {
      variant: 'default',
    };
    expect(validProps.variant).toBe('default');

    // TypeScript compile-time check - invalid variant would cause TS error
    // const invalidProps: CardProps = { variant: 'invalid' }; // This would fail TS
  });
});
