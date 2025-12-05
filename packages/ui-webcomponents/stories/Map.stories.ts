import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { createSampleStory } from '@design/ui-core';
import '../src/map';
import 'mapbox-gl/dist/mapbox-gl.css';

const meta = {
  title: 'Web Components/Map',
  component: 'design-map',
  tags: ['autodocs'],
  argTypes: {
    accessToken: {
      control: 'text',
      description:
        'Mapbox access token. REQUIRED: Get a free token at https://account.mapbox.com/access-tokens/ - Create an account and copy your default public token.',
    },
    initialStyle: {
      control: { type: 'select' },
      options: [
        'mapbox://styles/mapbox/dark-v11',
        'mapbox://styles/mapbox/light-v11',
        'mapbox://styles/mapbox/streets-v12',
        'mapbox://styles/mapbox/outdoors-v12',
        'mapbox://styles/mapbox/satellite-v9',
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
A narrative map component built with Ulysses for story-driven map experiences.

**⚠️ IMPORTANT: You need a Mapbox access token to use this component.**

### How to get started:

1. **Get a free Mapbox token:**
   - Go to https://account.mapbox.com/access-tokens/
   - Create a free account
   - Copy your default public token (starts with "pk.")

2. **Add your token:**
   - In Storybook Controls panel below, paste your token in the "accessToken" field
   - The map will load immediately

3. **Navigate the story:**
   - Click Previous/Next buttons
   - Or click the step indicator dots
   - Watch the map fly to different locations

The placeholder token in these stories will NOT work - you must replace it with your own.
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const sampleStory = createSampleStory();

export const SanFranciscoTour: Story = {
  args: {
    accessToken: 'pk.eyJ1IjoibnVrbmlnaHRsYWIiLCJhIjoieUpRU1FOWSJ9.f7Z1min5DNfTPBIb7RbnGA',
    steps: sampleStory,
    initialStyle: 'mapbox://styles/mapbox/dark-v11',
    initialCenter: [-122.4194, 37.7749],
    initialZoom: 12,
  },
  render: (args) => html`
    <design-map
      access-token=${args.accessToken}
      .steps=${args.steps}
      initial-style=${args.initialStyle}
      .initialCenter=${args.initialCenter}
      initial-zoom=${args.initialZoom}
    ></design-map>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'A sample narrative tour of San Francisco landmarks. Use the Previous/Next buttons or click the step indicators to navigate through the story.',
      },
    },
  },
};

export const CustomStyle: Story = {
  args: {
    accessToken: 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example_token_replace_with_real',
    steps: sampleStory,
    initialStyle: 'mapbox://styles/mapbox/satellite-v9',
    initialCenter: [-122.4194, 37.7749],
    initialZoom: 11,
  },
  render: (args) => html`
    <design-map
      access-token=${args.accessToken}
      .steps=${args.steps}
      initial-style=${args.initialStyle}
      .initialCenter=${args.initialCenter}
      initial-zoom=${args.initialZoom}
    ></design-map>
  `,
  parameters: {
    docs: {
      description: {
        story: 'The same tour with a satellite map style.',
      },
    },
  },
};
