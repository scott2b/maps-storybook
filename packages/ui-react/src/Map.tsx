import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Ulysses from 'ulysses-js';
import type { MapProps } from '@design/ui-core';
import { colors } from '@design/ui-core';
import './Map.css';

export interface ReactMapProps extends MapProps {
  className?: string;
}

export function Map({
  accessToken,
  steps,
  initialStyle = 'mapbox://styles/mapbox/dark-v11',
  initialCenter = [-122.4194, 37.7749],
  initialZoom = 12,
  className,
}: ReactMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const storyRef = useRef<Ulysses | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = steps.features.length;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Set the access token
    mapboxgl.accessToken = accessToken;

    // Initialize the map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: initialCenter,
      zoom: initialZoom,
    });

    mapRef.current = map;

    // Track the unsubscribe function for cleanup
    let unsubscribeFromStory: (() => void) | null = null;

    // Initialize Ulysses story when map loads
    map.on('load', () => {
      const story = new Ulysses({
        map,
        steps,
      });

      storyRef.current = story;
      // Initialize current step from Ulysses
      setCurrentStep(story.current || 0);

      // Listen to Ulysses events for state synchronization
      unsubscribeFromStory = story.on('step', (event: { detail: { index: number } }) => {
        setCurrentStep(event.detail.index);
      });
    });

    // Cleanup on unmount
    return () => {
      unsubscribeFromStory?.();
      map.remove();
      mapRef.current = null;
      storyRef.current = null;
    };
  }, [accessToken, steps, initialStyle, initialCenter, initialZoom]);

  // Handlers simply call Ulysses methods - events handle state updates
  const handleNext = () => {
    storyRef.current?.next();
  };

  const handlePrevious = () => {
    storyRef.current?.previous();
  };

  const handleStep = (index: number) => {
    storyRef.current?.step(index);
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
