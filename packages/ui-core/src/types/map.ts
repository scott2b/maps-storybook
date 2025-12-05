import type { Map as MapboxMap } from 'mapbox-gl';

/**
 * A step in the narrative map story
 * Based on GeoJSON Feature format used by Ulysses
 */
export interface MapStoryStep {
  type: 'Feature';
  geometry: {
    type: 'Point' | 'Polygon';
    coordinates: number[] | number[][] | number[][][];
  };
  properties: {
    title?: string;
    description?: string;
    action?: string;
    // Allow additional custom properties
    [key: string]: unknown;
  };
}

/**
 * Collection of story steps
 */
export interface MapStorySteps {
  type: 'FeatureCollection';
  features: MapStoryStep[];
}

/**
 * Action function that can be executed at each step
 */
export type MapAction = (map: MapboxMap, feature: MapStoryStep) => void;

/**
 * Configuration for initializing an Ulysses story
 */
export interface UlyssesConfig {
  map: MapboxMap;
  steps: MapStorySteps;
  actions?: Record<string, MapAction>;
}

/**
 * Props for Map components across frameworks
 */
export interface MapProps {
  accessToken: string;
  steps: MapStorySteps;
  initialStyle?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  className?: string;
}
