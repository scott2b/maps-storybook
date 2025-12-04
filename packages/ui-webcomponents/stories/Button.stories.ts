import type { Meta, StoryObj } from '@storybook/web-components';
import '../src/button';

const meta = {
  title: 'Web Components/Button',
  tags: ['autodocs'],
  render: (args) => `
    <design-button
      label="${args.label}"
      ${args.primary ? 'primary' : ''}
      size="${args.size}"
    ></design-button>
  `,
  argTypes: {
    label: { control: 'text' },
    primary: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
    size: 'medium',
  },
};

export const Secondary: Story = {
  args: {
    primary: false,
    label: 'Button',
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Button',
    primary: false,
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
    primary: false,
  },
};
