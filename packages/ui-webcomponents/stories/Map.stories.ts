import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import mapboxgl, { type Map as MapboxMap } from 'mapbox-gl';
import type { MapStoryStep } from '@design/ui-core';
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

const customActionsSteps = {
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [-122.4194, 37.7749],
      },
      properties: {
        title: 'Downtown San Francisco',
        description: 'Enabling 3D buildings layer to see the skyline.',
        action: 'enable3D',
      },
    },
    {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [-122.4183, 37.8199],
      },
      properties: {
        title: 'Golden Gate Bridge',
        description: 'Switching to satellite view to see terrain.',
        action: 'switchToSatellite',
      },
    },
    {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [-122.4177, 37.8099],
      },
      properties: {
        title: 'Presidio',
        description: 'Drawing a 500m radius circle around the Presidio.',
        action: 'drawCircle',
        radius: 500,
      },
    },
    {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [-122.4230, 37.8267],
      },
      properties: {
        title: 'Alcatraz Island',
        description: 'Showing a custom popup with rich HTML content.',
        action: 'showPopup',
      },
    },
  ],
};

const customActionsMap = {
  enable3D: (map: MapboxMap, feature: MapStoryStep) => {
    const coords = feature.geometry.coordinates as [number, number];

    map.flyTo({
      center: coords,
      zoom: 16,
      pitch: 60,
      bearing: -17.6,
      duration: 3000,
    });

    // Wait for map to load style layers
    map.once('idle', () => {
      // Add 3D buildings layer if it doesn't exist
      if (!map.getLayer('3d-buildings')) {
        const layers = map.getStyle().layers;
        const labelLayerId = layers?.find(
          (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
        )?.id;

        map.addLayer(
          {
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 15,
            paint: {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
              'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']],
              'fill-extrusion-opacity': 0.6,
            },
          },
          labelLayerId
        );
      }
    });
  },
  switchToSatellite: (map: MapboxMap, feature: MapStoryStep) => {
    const coords = feature.geometry.coordinates as [number, number];

    // Change map style to satellite
    map.setStyle('mapbox://styles/mapbox/satellite-v9');

    // Fly to location after style loads
    map.once('style.load', () => {
      map.flyTo({
        center: coords,
        zoom: 15,
        pitch: 0,
        bearing: 0,
        duration: 3000,
      });
    });
  },
  drawCircle: (map: MapboxMap, feature: MapStoryStep) => {
    const coords = feature.geometry.coordinates as [number, number];
    const radiusInMeters = feature.properties.radius || 500;

    map.flyTo({
      center: coords,
      zoom: 14,
      pitch: 0,
      duration: 2000,
    });

    map.once('idle', () => {
      // Remove existing circle if it exists
      if (map.getSource('circle-source')) {
        map.removeLayer('circle-layer');
        map.removeSource('circle-source');
      }

      // Create circle using turf.js approximation
      const steps = 64;
      const coordinates = [];
      for (let i = 0; i < steps; i++) {
        const angle = (i / steps) * 2 * Math.PI;
        const dx = radiusInMeters * Math.cos(angle);
        const dy = radiusInMeters * Math.sin(angle);
        const lon = coords[0] + (dx / 111320);
        const lat = coords[1] + (dy / 110540);
        coordinates.push([lon, lat]);
      }
      coordinates.push(coordinates[0]); // Close the circle

      map.addSource('circle-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates],
          },
          properties: {},
        },
      });

      map.addLayer({
        id: 'circle-layer',
        type: 'fill',
        source: 'circle-source',
        paint: {
          'fill-color': '#0f766e',
          'fill-opacity': 0.3,
        },
      });

      map.addLayer({
        id: 'circle-outline',
        type: 'line',
        source: 'circle-source',
        paint: {
          'line-color': '#0f766e',
          'line-width': 2,
        },
      });
    });
  },
  showPopup: (map: MapboxMap, feature: MapStoryStep) => {
    const coords = feature.geometry.coordinates as [number, number];

    map.flyTo({
      center: coords,
      zoom: 14,
      pitch: 0,
      bearing: 0,
      duration: 2000,
    });

    map.once('idle', () => {
      new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(coords)
        .setHTML(
          `<div style="padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Alcatraz Island</h3>
            <p style="margin: 0; font-size: 14px;">Famous federal prison from 1934-1963. Now a popular tourist destination.</p>
          </div>`
        )
        .addTo(map);
    });
  },
};

export const CustomActions: Story = {
  args: {
    accessToken: 'pk.eyJ1IjoibnVrbmlnaHRsYWIiLCJhIjoieUpRU1FOWSJ9.f7Z1min5DNfTPBIb7RbnGA',
    steps: customActionsSteps,
    actions: customActionsMap,
    initialStyle: 'mapbox://styles/mapbox/dark-v11',
    initialCenter: [-122.4194, 37.7749],
    initialZoom: 12,
  },
  render: (args) => html`
    <design-map
      access-token=${args.accessToken}
      .steps=${args.steps}
      .actions=${args.actions}
      initial-style=${args.initialStyle}
      .initialCenter=${args.initialCenter}
      initial-zoom=${args.initialZoom}
    ></design-map>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates truly custom Ulysses actions that go beyond built-in capabilities:\n\n- **3D buildings layer**: Dynamically adds a 3D extrusion layer with tilt/rotation\n- **Style switching**: Changes map style mid-story from dark to satellite\n- **Custom geometry**: Draws a circle radius that isn\'t a GeoJSON feature\n- **Rich popups**: Displays custom HTML popup with formatted content',
      },
    },
  },
};
