import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import mapboxgl from 'mapbox-gl';
import Ulysses from 'ulysses-js';
import { type MapStorySteps, colors } from '@design/ui-core';

@customElement('design-map')
export class DesignMap extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .map-container {
      position: relative;
      width: 100%;
      height: 600px;
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
      background: linear-gradient(
        to top,
        ${unsafeCSS(colors.surface)} 0%,
        ${unsafeCSS(colors.surface)} 60%,
        transparent 100%
      );
      padding: 2rem 1.5rem 1.5rem;
      color: ${unsafeCSS(colors.text)};
    }

    .step-info {
      margin-bottom: 1rem;
      min-height: 4rem;
    }

    .step-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: ${unsafeCSS(colors.text)};
    }

    .step-description {
      font-size: 0.875rem;
      color: ${unsafeCSS(colors.text)};
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
      background-color: ${unsafeCSS(colors.primary)};
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
      border: 2px solid ${unsafeCSS(colors.text)};
      background: transparent;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 0;
    }

    .step-dot:hover {
      transform: scale(1.2);
    }

    .step-dot.active {
      background-color: ${unsafeCSS(colors.primary)};
      border-color: ${unsafeCSS(colors.primary)};
    }
  `;

  // Disable Shadow DOM - Mapbox GL doesn't work inside Shadow DOM
  // Use Light DOM instead so Mapbox can access the map container directly
  createRenderRoot() {
    return this;
  }

  @property({ type: String, attribute: 'access-token' })
  accessToken = '';

  @property({ type: Object })
  steps: MapStorySteps = { type: 'FeatureCollection', features: [] };

  @property({ type: String, attribute: 'initial-style' })
  initialStyle = 'mapbox://styles/mapbox/dark-v11';

  @property({ type: Array, attribute: 'initial-center' })
  initialCenter: [number, number] = [-122.4194, 37.7749];

  @property({ type: Number, attribute: 'initial-zoom' })
  initialZoom = 12;

  @state()
  private currentStep = 0;

  @query('.map')
  private mapContainer!: HTMLDivElement;

  private map: mapboxgl.Map | null = null;
  private story: Ulysses | null = null;

  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    // Re-initialize map when accessToken changes
    if (changedProperties.has('accessToken') && this.accessToken) {
      this._initializeMap();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.map?.remove();
    this.map = null;
    this.story = null;
  }

  private _initializeMap() {
    if (!this.mapContainer || !this.accessToken) return;

    // Clean up existing map
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.story = null;
    }

    // Set the access token
    mapboxgl.accessToken = this.accessToken;

    // Initialize the map
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: this.initialStyle,
      center: this.initialCenter,
      zoom: this.initialZoom,
    });

    // Initialize Ulysses story when map loads
    this.map.on('load', () => {
      if (this.map) {
        this.story = new Ulysses({
          map: this.map,
          steps: this.steps,
        });

        this.currentStep = this.story.current || 0;
      }
    });
  }

  private _handleNext() {
    if (this.story) {
      this.story.next();
      this.currentStep = this.story.current || 0;
      this.dispatchEvent(
        new CustomEvent('step-change', {
          detail: { step: this.currentStep },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private _handlePrevious() {
    if (this.story) {
      this.story.previous();
      this.currentStep = this.story.current || 0;
      this.dispatchEvent(
        new CustomEvent('step-change', {
          detail: { step: this.currentStep },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private _handleStep(index: number) {
    if (this.story) {
      this.story.step(index);
      this.currentStep = this.story.current || 0;
      this.dispatchEvent(
        new CustomEvent('step-change', {
          detail: { step: this.currentStep },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  render() {
    const currentStepData =
      this.steps.features[this.currentStep] || this.steps.features[0];
    const totalSteps = this.steps.features.length;

    return html`
      <style>
        .map-container {
          position: relative;
          width: 100%;
          height: 600px;
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
          background: linear-gradient(
            to top,
            ${colors.surface} 0%,
            ${colors.surface} 60%,
            transparent 100%
          );
          padding: 2rem 1.5rem 1.5rem;
          color: ${colors.text};
        }

        .step-info {
          margin-bottom: 1rem;
          min-height: 4rem;
        }

        .step-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          color: ${colors.text};
        }

        .step-description {
          font-size: 0.875rem;
          color: ${colors.text};
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
          background-color: ${colors.primary};
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
          border: 2px solid ${colors.text};
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0;
        }

        .step-dot:hover {
          transform: scale(1.2);
        }

        .step-dot.active {
          background-color: ${colors.primary};
          border-color: ${colors.primary};
        }
      </style>

      <div class="map-container">
        <div class="map"></div>

        <div class="controls">
          <div class="step-info">
            ${currentStepData?.properties?.title
              ? html`<h3 class="step-title">
                  ${currentStepData.properties.title}
                </h3>`
              : ''}
            ${currentStepData?.properties?.description
              ? html`<p class="step-description">
                  ${currentStepData.properties.description}
                </p>`
              : ''}
          </div>

          <div class="navigation">
            <button
              @click=${this._handlePrevious}
              ?disabled=${this.currentStep === 0}
              class="nav-button"
            >
              Previous
            </button>

            <div class="step-indicator">
              ${this.steps.features.map(
                (_, index) => html`
                  <button
                    @click=${() => this._handleStep(index)}
                    class="step-dot ${index === this.currentStep
                      ? 'active'
                      : ''}"
                    aria-label="Go to step ${index + 1}"
                  ></button>
                `
              )}
            </div>

            <button
              @click=${this._handleNext}
              ?disabled=${this.currentStep >= totalSteps - 1}
              class="nav-button"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'design-map': DesignMap;
  }
}
