import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type CardVariant, colors } from '@design/ui-core';

@customElement('design-card')
export class DesignCard extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .card {
      background-color: ${unsafeCSS(colors.surface)};
      border-radius: 0.5rem;
      padding: 1.5rem;
      transition: all 0.2s ease;
      color: ${unsafeCSS(colors.text)};
    }

    .variant-default {
      border: none;
      box-shadow: none;
    }

    .variant-elevated {
      border: none;
      box-shadow:
        0 4px 6px -1px rgb(0 0 0 / 0.1),
        0 2px 4px -2px rgb(0 0 0 / 0.1);
    }

    .variant-outlined {
      border: 1px solid rgba(229, 231, 235, 0.125);
      box-shadow: none;
    }

    .clickable {
      cursor: pointer;
    }

    .clickable:hover {
      transform: translateY(-2px);
      box-shadow:
        0 10px 15px -3px rgb(0 0 0 / 0.1),
        0 4px 6px -4px rgb(0 0 0 / 0.1);
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: ${unsafeCSS(colors.text)};
    }

    .card-description {
      font-size: 0.875rem;
      color: ${unsafeCSS(colors.text)};
      opacity: 0.8;
      line-height: 1.5;
      margin: 0;
    }
  `;

  @property({ type: String })
  title = '';

  @property({ type: String })
  description = '';

  @property({ type: String })
  variant: CardVariant = 'default';

  @property({ type: Boolean })
  clickable = false;

  private _handleKeyDown(e: KeyboardEvent) {
    if (this.clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      this.click();
    }
  }

  render() {
    const classes = ['card', `variant-${this.variant}`, this.clickable ? 'clickable' : '']
      .filter(Boolean)
      .join(' ');

    return html`
      <div
        class=${classes}
        role=${this.clickable ? 'button' : 'article'}
        tabindex=${this.clickable ? 0 : undefined}
        @keydown=${this._handleKeyDown}
      >
        ${this.title ? html`<h3 class="card-title">${this.title}</h3>` : ''}
        ${this.description ? html`<p class="card-description">${this.description}</p>` : ''}
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'design-card': DesignCard;
  }
}
