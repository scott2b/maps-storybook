import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Card } from './Card';

describe('React Card Component', () => {
  describe('rendering', () => {
    it('should render without props', () => {
      const { container } = render(<Card />);
      const card = container.querySelector('.card');
      expect(card).toBeTruthy();
    });

    it('should render title when provided', () => {
      render(<Card title="Test Title" />);
      const title = screen.getByText('Test Title');
      expect(title).toBeTruthy();
      expect(title.tagName).toBe('H3');
      expect(title.className).toContain('card-title');
    });

    it('should render description when provided', () => {
      render(<Card description="Test description" />);
      const description = screen.getByText('Test description');
      expect(description).toBeTruthy();
      expect(description.tagName).toBe('P');
      expect(description.className).toContain('card-description');
    });

    it('should render both title and description', () => {
      const { container } = render(<Card title="Test Title" description="Test description" />);
      const titles = container.querySelectorAll('.card-title');
      const descriptions = container.querySelectorAll('.card-description');
      expect(titles.length).toBeGreaterThan(0);
      expect(descriptions.length).toBeGreaterThan(0);
      expect(titles[titles.length - 1]?.textContent).toBe('Test Title');
      expect(descriptions[descriptions.length - 1]?.textContent).toBe('Test description');
    });

    it('should render children', () => {
      render(
        <Card title="Test">
          <p>Child content</p>
        </Card>
      );
      expect(screen.getByText('Child content')).toBeTruthy();
    });
  });

  describe('variants', () => {
    it('should apply default variant class', () => {
      const { container } = render(<Card variant="default" />);
      const card = container.querySelector('.card');
      expect(card?.classList.contains('variant-default')).toBe(true);
    });

    it('should apply elevated variant class', () => {
      const { container } = render(<Card variant="elevated" />);
      const card = container.querySelector('.card');
      expect(card?.classList.contains('variant-elevated')).toBe(true);
    });

    it('should apply outlined variant class', () => {
      const { container } = render(<Card variant="outlined" />);
      const card = container.querySelector('.card');
      expect(card?.classList.contains('variant-outlined')).toBe(true);
    });

    it('should use default variant when not specified', () => {
      const { container } = render(<Card />);
      const card = container.querySelector('.card');
      expect(card?.classList.contains('variant-default')).toBe(true);
    });
  });

  describe('clickable behavior', () => {
    it('should apply clickable class when clickable is true', () => {
      const { container } = render(<Card clickable />);
      const card = container.querySelector('.card');
      expect(card?.classList.contains('clickable')).toBe(true);
    });

    it('should have button role when clickable', () => {
      const { container } = render(<Card clickable />);
      const card = container.querySelector('.card');
      expect(card?.getAttribute('role')).toBe('button');
    });

    it('should have tabindex 0 when clickable', () => {
      const { container } = render(<Card clickable />);
      const card = container.querySelector('.card');
      expect(card?.getAttribute('tabindex')).toBe('0');
    });

    it('should have article role when not clickable', () => {
      const { container } = render(<Card clickable={false} />);
      const card = container.querySelector('.card');
      expect(card?.getAttribute('role')).toBe('article');
    });

    it('should trigger onClick when clicked', async () => {
      const user = userEvent.setup();
      let clicked = false;
      const { container } = render(
        <Card
          clickable
          onClick={() => {
            clicked = true;
          }}
        />
      );

      const card = container.querySelector('.card') as HTMLElement;
      await user.click(card);
      expect(clicked).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should be keyboard accessible when clickable', () => {
      const { container } = render(<Card clickable />);
      const card = container.querySelector('.card');
      expect(card?.getAttribute('tabindex')).toBe('0');
      expect(card?.getAttribute('role')).toBe('button');
    });

    it('should have proper heading hierarchy', () => {
      const { container } = render(<Card title="Heading Test" />);
      const title = container.querySelector('.card-title');
      expect(title?.tagName).toBe('H3');
      expect(title?.textContent).toBe('Heading Test');
    });
  });

  describe('styling', () => {
    it('should have base card class', () => {
      const { container } = render(<Card />);
      const card = container.querySelector('.card');
      expect(card).toBeTruthy();
    });

    it('should combine variant and clickable classes', () => {
      const { container } = render(<Card variant="elevated" clickable />);
      const card = container.querySelector('.card');
      expect(card?.classList.contains('variant-elevated')).toBe(true);
      expect(card?.classList.contains('clickable')).toBe(true);
    });
  });
});
