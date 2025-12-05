<script lang="ts">
  import mapboxgl from 'mapbox-gl';
  import Ulysses from 'ulysses-js';
  import type { MapProps } from '@design/ui-core';
  import { colors } from '@design/ui-core';

  let {
    accessToken,
    steps,
    initialStyle = 'mapbox://styles/mapbox/dark-v11',
    initialCenter = [-122.4194, 37.7749] as [number, number],
    initialZoom = 12,
  }: MapProps = $props();

  // eslint-disable-next-line no-undef
  let mapContainer: HTMLDivElement;
  let map: mapboxgl.Map | null = null;
  let story: Ulysses | null = null;
  let currentStep = $state(0);
  let totalSteps = $state(steps.features.length);

  // Initialize map when container is ready and token changes
  $effect(() => {
    if (!mapContainer || !accessToken) return;

    // Set the access token
    mapboxgl.accessToken = accessToken;

    // Clean up existing map
    if (map) {
      map.remove();
      map = null;
      story = null;
    }

    // Initialize the map
    map = new mapboxgl.Map({
      container: mapContainer,
      style: initialStyle,
      center: initialCenter,
      zoom: initialZoom,
    });

    // Initialize Ulysses story
    map.on('load', () => {
      if (map) {
        story = new Ulysses({
          map,
          steps,
        });

        // Initialize current step from Ulysses
        currentStep = story.current || 0;
      }
    });

    // Cleanup function
    return () => {
      map?.remove();
      map = null;
      story = null;
    };
  });

  // Listen to Ulysses events for state synchronization
  $effect(() => {
    if (!story) return;

    // Subscribe to step changes
    const unsubscribe = story.on('step', (event: { detail: { index: number } }) => {
      currentStep = event.detail.index;
    });

    // Return cleanup function
    return unsubscribe;
  });

  // Handlers simply call Ulysses methods - events handle state updates
  function handleNext() {
    story?.next();
  }

  function handlePrevious() {
    story?.previous();
  }

  function handleStep(index: number) {
    story?.step(index);
  }

  // Update total steps when steps prop changes
  $effect(() => {
    totalSteps = steps.features.length;
  });

  const currentStepData = $derived(steps.features[currentStep] || steps.features[0]);
</script>

<div
  class="map-container"
  style="--surface-color: {colors.surface}; --text-color: {colors.text}; --primary-color: {colors.primary}"
>
  <div bind:this={mapContainer} class="map"></div>

  <div class="controls">
    <div class="step-info">
      {#if currentStepData?.properties?.title}
        <h3 class="step-title">{currentStepData.properties.title}</h3>
      {/if}
      {#if currentStepData?.properties?.description}
        <p class="step-description">{currentStepData.properties.description}</p>
      {/if}
    </div>

    <div class="navigation">
      <button onclick={handlePrevious} disabled={currentStep === 0} class="nav-button">
        Previous
      </button>

      <div class="step-indicator">
        {#each steps.features as _, index}
          <button
            onclick={() => handleStep(index)}
            class="step-dot"
            class:active={index === currentStep}
            aria-label="Go to step {index + 1}"
          />
        {/each}
      </div>

      <button onclick={handleNext} disabled={currentStep >= totalSteps - 1} class="nav-button">
        Next
      </button>
    </div>
  </div>
</div>

<style>
  .map-container {
    position: relative;
    width: 100%;
    height: 100vh;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .map {
    width: 100%;
    height: 100%;
  }

  .controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    background: linear-gradient(
      to top,
      var(--surface-color, #020617) 0%,
      var(--surface-color, #020617) 60%,
      transparent 100%
    );
    padding: 2rem 1.5rem 1.5rem;
    color: var(--text-color, #e5e7eb);
  }

  .step-info {
    margin-bottom: 1rem;
    min-height: 4rem;
  }

  .step-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: var(--text-color, #e5e7eb);
  }

  .step-description {
    font-size: 0.875rem;
    color: var(--text-color, #e5e7eb);
    opacity: 0.9;
    margin: 0;
  }

  .navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .nav-button {
    background-color: var(--primary-color, #0f766e);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .nav-button:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .nav-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .step-indicator {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .step-dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    border: 2px solid var(--text-color, #e5e7eb);
    background: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
  }

  .step-dot:hover {
    transform: scale(1.2);
  }

  .step-dot.active {
    background-color: var(--primary-color, #0f766e);
    border-color: var(--primary-color, #0f766e);
  }
</style>
