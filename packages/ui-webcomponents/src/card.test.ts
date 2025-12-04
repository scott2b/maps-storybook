import { describe, it, expect, beforeEach } from 'vitest';
import './card';

describe('Web Components Card', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  describe('rendering', () => {
    it('should render without attributes', async () => {
      container.innerHTML = '<design-card></design-card>';
      const card = container.querySelector('design-card');
      expect(card).toBeTruthy();
      await card?.updateComplete;
      const shadowRoot = card?.shadowRoot;
      expect(shadowRoot).toBeTruthy();
    });

    it('should render title when provided', async () => {
      container.innerHTML = '<design-card title="Test Title"></design-card>';
      const card = container.querySelector('design-card') as any;
      await card?.updateComplete;
      const shadowRoot = card?.shadowRoot;
      const title = shadowRoot?.querySelector('.card-title');
      expect(title?.textContent).toBe('Test Title');
      expect(title?.tagName).toBe('H3');
    });

    it('should render description when provided', async () => {
      container.innerHTML = '<design-card description="Test description"></design-card>';
      const card = container.querySelector('design-card') as any;
      await card?.updateComplete;
      const shadowRoot = card?.shadowRoot;
      const description = shadowRoot?.querySelector('.card-description');
      expect(description?.textContent).toBe('Test description');
      expect(description?.tagName).toBe('P');
    });

    it('should render both title and description', async () => {
      container.innerHTML =
        '<design-card title="Test Title" description="Test description"></design-card>';
      const card = container.querySelector('design-card') as any;
      await card?.updateComplete;
      const shadowRoot = card?.shadowRoot;
      const title = shadowRoot?.querySelector('.card-title');
      const description = shadowRoot?.querySelector('.card-description');
      expect(title?.textContent).toBe('Test Title');
      expect(description?.textContent).toBe('Test description');
    });

    it('should render slotted content', async () => {
      container.innerHTML = '<design-card><p>Slotted content</p></design-card>';
      const card = container.querySelector('design-card') as any;
      await card?.updateComplete;
      const slotted = container.querySelector('p');
      expect(slotted?.textContent).toBe('Slotted content');
    });
  });

  describe('variants', () => {
    it('should apply default variant class', async () => {
      container.innerHTML = '<design-card variant="default"></design-card>';
      const card = container.querySelector('design-card') as any;
      await card?.updateComplete;
      const shadowRoot = card?.shadowRoot;
      const cardDiv = shadowRoot?.querySelector('.card');
      expect(cardDiv?.classList.contains('variant-default')).toBe(true);
    });

    it('should apply elevated variant class', async () => {
      container.innerHTML = '<design-card variant="elevated"></design-card>';
      const card = container.querySelector('design-card') as any;
      await card?.updateComplete;
      const shadowRoot = card?.shadowRoot;
      const cardDiv = shadowRoot?.querySelector('.card');
      expect(cardDiv?.classList.contains('variant-elevated')).toBe(true);
    });

    it('should apply outlined variant class', async () => {
      container.innerHTML = '<design-card variant="outlined"></design-card>';
      const card = container.querySelector('design-card') as any;
      await card?.updateComplete;
      const shadowRoot = card?.shadowRoot;
      const cardDiv = shadowRoot?.querySelector('.card');
      expect(cardDiv?.classList.contains('variant-outlined')).toBe(true);
    });

    it('should use default variant when not specified', async () => {
      container.innerHTML = '<design-card></design-card>';
      const card = container.querySelector('design-card') as any;
      await card?.updateComplete;
      const shadowRoot = card?.shadowRoot;
      const cardDiv = shadowRoot?.querySelector('.card');
      expect(cardDiv?.classList.contains('variant-default')).toBe(true);
    });
  });

  describe('clickable behavior', () => {
    it('should apply clickable class when clickable is true', async () => {
      container.innerHTML = '<design-card clickable></design-card>';
      const card = container.querySelector('design-card') as any;
      await card?.updateComplete;
      const shadowRoot = card?.shadowRoot;
      const cardDiv = shadowRoot?.querySelector('.card');
      expect(cardDiv?.classList.contains('clickable')).toBe(true);
    });

    it('should have button role when clickable', async () => {
      container.innerHTML = '<design-card clickable></design-card>';
      const card = container.querySelector('design-card') as any;
      await card?.updateComplete;
      const shadowRoot = card?.shadowRoot;
      const cardDiv = shadowRoot?.querySelector('.card');
      expect(cardDiv?.getAttribute('role')).toBe('button');
    });

    it('should have tabindex 0 when clickable', async () => {
      container.innerHTML = '<design-card clickable></design-card>';
      const card = container.querySelector('design-card') as any;
      await card?.updateComplete;
      const shadowRoot = card?.shadowRoot;
      const cardDiv = shadowRoot?.querySelector('.card');
      expect(cardDiv?.getAttribute('tabindex')).toBe('0');
    });

    it('should have article role when not clickable', async () => {
      container.innerHTML = '<design-card></design-card>';
      const card = container.querySelector('design-card') as any;
      await card?.updateComplete;
      const shadowRoot = card?.shadowRoot;
      const cardDiv = shadowRoot?.querySelector('.card');
      expect(cardDiv?.getAttribute('role')).toBe('article');
    });
  });

  describe('properties', () => {
    it('should update title property', async () => {
      container.innerHTML = '<design-card></design-card>';
      const card = container.querySelector('design-card') as any;
      await card?.updateComplete;

      card.title = 'New Title';
      await card?.updateComplete;

      const shadowRoot = card?.shadowRoot;
      const title = shadowRoot?.querySelector('.card-title');
      expect(title?.textContent).toBe('New Title');
    });

    it('should update description property', async () => {
      container.innerHTML = '<design-card></design-card>';
      const card = container.querySelector('design-card') as any;
      await card?.updateComplete;

      card.description = 'New description';
      await card?.updateComplete;

      const shadowRoot = card?.shadowRoot;
      const description = shadowRoot?.querySelector('.card-description');
      expect(description?.textContent).toBe('New description');
    });

    it('should update variant property', async () => {
      container.innerHTML = '<design-card></design-card>';
      const card = container.querySelector('design-card') as any;
      await card?.updateComplete;

      card.variant = 'elevated';
      await card?.updateComplete;

      const shadowRoot = card?.shadowRoot;
      const cardDiv = shadowRoot?.querySelector('.card');
      expect(cardDiv?.classList.contains('variant-elevated')).toBe(true);
    });

    it('should update clickable property', async () => {
      container.innerHTML = '<design-card></design-card>';
      const card = container.querySelector('design-card') as any;
      await card?.updateComplete;

      card.clickable = true;
      await card?.updateComplete;

      const shadowRoot = card?.shadowRoot;
      const cardDiv = shadowRoot?.querySelector('.card');
      expect(cardDiv?.classList.contains('clickable')).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should be keyboard accessible when clickable', async () => {
      container.innerHTML = '<design-card clickable></design-card>';
      const card = container.querySelector('design-card') as any;
      await card?.updateComplete;
      const shadowRoot = card?.shadowRoot;
      const cardDiv = shadowRoot?.querySelector('.card');
      expect(cardDiv?.getAttribute('tabindex')).toBe('0');
      expect(cardDiv?.getAttribute('role')).toBe('button');
    });

    it('should have proper heading hierarchy', async () => {
      container.innerHTML = '<design-card title="Test Title"></design-card>';
      const card = container.querySelector('design-card') as any;
      await card?.updateComplete;
      const shadowRoot = card?.shadowRoot;
      const title = shadowRoot?.querySelector('.card-title');
      expect(title?.tagName).toBe('H3');
    });
  });
});
