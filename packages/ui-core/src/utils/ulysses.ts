import type { MapStorySteps } from '../types/map';

/**
 * Creates a sample story for demo purposes
 * Features locations in San Francisco
 */
export function createSampleStory(): MapStorySteps {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.4194, 37.7749],
        },
        properties: {
          title: 'Welcome to San Francisco',
          description: 'Our journey begins in the heart of the city.',
          action: 'flyTo',
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
          description: 'An iconic landmark spanning the Golden Gate strait.',
          action: 'flyTo',
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.4177, 37.8099],
        },
        properties: {
          title: 'Presidio',
          description: 'A historic military post turned national park.',
          action: 'flyTo',
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.4058, 37.8021],
        },
        properties: {
          title: 'Fort Mason',
          description: 'A former US Army post with stunning bay views.',
          action: 'flyTo',
        },
      },
    ],
  };
}

/**
 * Validates that a MapStorySteps object has the correct structure
 */
export function validateStorySteps(steps: unknown): steps is MapStorySteps {
  if (typeof steps !== 'object' || steps === null) {
    return false;
  }

  const stepsObj = steps as Record<string, unknown>;

  if (stepsObj.type !== 'FeatureCollection') {
    return false;
  }

  if (!Array.isArray(stepsObj.features)) {
    return false;
  }

  return stepsObj.features.every((feature) => {
    return (
      typeof feature === 'object' &&
      feature !== null &&
      feature.type === 'Feature' &&
      typeof feature.geometry === 'object' &&
      typeof feature.properties === 'object'
    );
  });
}
