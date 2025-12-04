import type { Meta, StoryObj } from '@storybook/web-components';
import { expect } from 'storybook/test';
import '../src/card';

const meta = {
  title: 'Web Components/Card',
  tags: ['autodocs'],
  render: (args) => `
    <design-card
      ${args.title ? `title="${args.title}"` : ''}
      ${args.description ? `description="${args.description}"` : ''}
      variant="${args.variant}"
      ${args.clickable ? 'clickable' : ''}
    ></design-card>
  `,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'outlined'],
    },
    clickable: { control: 'boolean' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Card Title',
    description: 'This is a card description with some example text to show how it looks.',
    variant: 'default',
    clickable: false,
  },
};

export const Elevated: Story = {
  args: {
    title: 'Elevated Card',
    description: 'This card has an elevated shadow effect.',
    variant: 'elevated',
    clickable: false,
  },
};

export const Outlined: Story = {
  args: {
    title: 'Outlined Card',
    description: 'This card has a subtle border outline.',
    variant: 'outlined',
    clickable: false,
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
    const card = canvasElement.querySelector('design-card');

    // Wait for custom element to be defined
    await customElements.whenDefined('design-card');

    // Verify the card has the clickable attribute and accessibility attributes
    await expect(card).toHaveAttribute('clickable');
    await expect(card?.shadowRoot?.querySelector('.card')).toHaveClass('clickable');

    const cardEl = card?.shadowRoot?.querySelector('.card');
    await expect(cardEl).toHaveAttribute('role', 'button');
    await expect(cardEl).toHaveAttribute('tabindex', '0');

    // Test keyboard interaction
    cardEl?.focus();
    await expect(card?.shadowRoot?.activeElement).toBe(cardEl);
  },
};
