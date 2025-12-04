import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { Card } from '../src/Card';

const meta: Meta<typeof Card> = {
  title: 'React/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'outlined'],
    },
    clickable: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Card Title',
    description: 'This is a card description with some example text to show how it looks.',
  },
};

export const Elevated: Story = {
  args: {
    title: 'Elevated Card',
    description: 'This card has an elevated shadow effect.',
    variant: 'elevated',
  },
};

export const Outlined: Story = {
  args: {
    title: 'Outlined Card',
    description: 'This card has a subtle border outline.',
    variant: 'outlined',
  },
};

export const Clickable: Story = {
  args: {
    title: 'Clickable Card',
    description: 'Hover over this card to see the interactive effect.',
    variant: 'elevated',
    clickable: true,
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('.card');

    // Verify the card has the clickable class and accessibility attributes
    await expect(card).toHaveClass('clickable');
    await expect(card).toHaveAttribute('role', 'button');
    await expect(card).toHaveAttribute('tabindex', '0');

    // Test keyboard interaction
    card?.focus();
    await expect(document.activeElement).toBe(card);
  },
};
