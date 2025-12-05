import type { Meta, StoryObj } from '@storybook/react';
import type { Map as MapboxMap } from 'mapbox-gl';
import type { MapStoryStep } from '@design/ui-core';
import { Map } from '../src/Map';
import { createSampleStory } from '@design/ui-core';
import 'mapbox-gl/dist/mapbox-gl.css';

const meta = {
  title: 'React/Map',
  component: Map,
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
} satisfies Meta<typeof Map>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SanFranciscoTour: Story = {
  args: {
    accessToken: 'pk.eyJ1IjoibnVrbmlnaHRsYWIiLCJhIjoieUpRU1FOWSJ9.f7Z1min5DNfTPBIb7RbnGA',
    steps: createSampleStory(),
    initialStyle: 'mapbox://styles/mapbox/dark-v11',
    initialCenter: [-122.4194, 37.7749],
    initialZoom: 12,
  },
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
    steps: createSampleStory(),
    initialStyle: 'mapbox://styles/mapbox/satellite-v9',
    initialCenter: [-122.4194, 37.7749],
    initialZoom: 11,
  },
  parameters: {
    docs: {
      description: {
        story: 'The same tour with a satellite map style.',
      },
    },
  },
};

export const CustomActions: Story = {
  args: {
    accessToken: 'pk.eyJ1IjoibnVrbmlnaHRsYWIiLCJhIjoieUpRU1FOWSJ9.f7Z1min5DNfTPBIb7RbnGA',
    steps: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-122.4353, 37.7749],
                [-122.4053, 37.7749],
                [-122.4053, 37.7949],
                [-122.4353, 37.7949],
                [-122.4353, 37.7749],
              ],
            ],
          },
          properties: {
            title: 'Financial District',
            description: 'Using fitBounds to frame a neighborhood polygon.',
            action: 'fitBounds',
          },
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-122.4183, 37.8199],
          },
          properties: {
            title: 'Golden Gate Bridge',
            description: 'Custom action adds a popup marker.',
            action: 'showPopup',
          },
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-122.4194, 37.7749],
          },
          properties: {
            title: 'Union Square',
            description: 'Standard flyTo action with custom zoom level.',
            action: 'flyTo',
            zoom: 15,
          },
        },
      ],
    },
    actions: {
      showPopup: (map: MapboxMap, feature: MapStoryStep) => {
        const coords = feature.geometry.coordinates as [number, number];

        // Import mapboxgl dynamically from the already-loaded instance
        import('mapbox-gl').then((mapboxgl) => {
          new mapboxgl.Popup()
            .setLngLat(coords)
            .setHTML(`<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`)
            .addTo(map);
        });

        map.flyTo({
          center: coords,
          zoom: 14,
          duration: 2000,
        });
      },
    },
    initialStyle: 'mapbox://styles/mapbox/dark-v11',
    initialCenter: [-122.4194, 37.7749],
    initialZoom: 12,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates advanced Ulysses features:\n\n- **Polygon geometry** with `fitBounds` action\n- **Custom actions** that create popups\n- **Mixed geometry types** (polygons and points)\n- **Property-based parameters** (custom zoom levels)',
      },
    },
  },
};
