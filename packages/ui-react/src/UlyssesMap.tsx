import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import maplibregl from 'maplibre-gl';
import Ulysses from 'ulysses-js';
import type { MapProps } from '@design/ui-core';
import { colors } from '@design/ui-core';
import './UlyssesMap.css';

export interface UlyssesMapProps extends MapProps {
  className?: string;
}

// Simple OSM raster style for MapLibre (no API key needed)
const osmRasterStyle = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm-tiles',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export function UlyssesMap({
  accessToken,
  steps,
  actions,
  initialStyle,
  initialCenter = [-122.4194, 37.7749],
  initialZoom = 12,
  className,
  mapLibrary = 'mapbox',
}: UlyssesMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | maplibregl.Map | null>(null);
  const storyRef = useRef<Ulysses | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = steps.features.length;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let map: mapboxgl.Map | maplibregl.Map;

    if (mapLibrary === 'maplibre') {
      // Use MapLibre GL
      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: initialStyle || osmRasterStyle,
        center: initialCenter as [number, number],
        zoom: initialZoom,
      });
    } else {
      // Use Mapbox GL (default)
      if (accessToken) {
        mapboxgl.accessToken = accessToken;
      }

      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: initialStyle || 'mapbox://styles/mapbox/dark-v11',
        center: initialCenter,
        zoom: initialZoom,
      });
    }

    mapRef.current = map;

    // Initialize Ulysses story when map loads
    map.on('load', () => {
      const story = new Ulysses({
        map: map as any, // Ulysses works with both Mapbox GL and MapLibre GL
        steps,
        actions,
      });

      storyRef.current = story;
      setCurrentStep(story.current || 0);
    });

    // Cleanup on unmount
    return () => {
      map.remove();
      mapRef.current = null;
      storyRef.current = null;
    };
  }, [accessToken, steps, actions, initialStyle, initialCenter, initialZoom, mapLibrary]);

  const handleNext = () => {
    if (storyRef.current) {
      storyRef.current.next();
      setCurrentStep(storyRef.current.current || 0);
    }
  };

  const handlePrevious = () => {
    if (storyRef.current) {
      storyRef.current.previous();
      setCurrentStep(storyRef.current.current || 0);
    }
  };

  const handleStep = (index: number) => {
    if (storyRef.current) {
      storyRef.current.step(index);
      setCurrentStep(storyRef.current.current || 0);
    }
  };

  const currentStepData = steps.features[currentStep] || steps.features[0];

  return (
    <div
      className={`map-container ${className || ''}`}
      style={
        {
          '--surface-color': colors.surface,
          '--text-color': colors.text,
          '--primary-color': colors.primary,
        } as React.CSSProperties
      }
    >
      <div ref={mapContainerRef} className="map" />

      <div className="controls">
        <div className="step-info">
          {currentStepData?.properties?.title && (
            <h3 className="step-title">{currentStepData.properties.title}</h3>
          )}
          {currentStepData?.properties?.description && (
            <p className="step-description">{currentStepData.properties.description}</p>
          )}
        </div>

        <div className="navigation">
          <button onClick={handlePrevious} disabled={currentStep === 0} className="nav-button">
            Previous
          </button>

          <div className="step-indicator">
            {steps.features.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStep(index)}
                className={`step-dot ${index === currentStep ? 'active' : ''}`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentStep >= totalSteps - 1}
            className="nav-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
