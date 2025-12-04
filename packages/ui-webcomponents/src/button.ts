import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { colors } from '@design/ui-core';

@customElement('design-button')
export class DesignButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    button {
      font-family: system-ui, sans-serif;
      font-weight: 600;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      display: inline-block;
      line-height: 1;
      transition: all 0.2s;
    }

    .primary {
      background-color: ${unsafeCSS(colors.primary)};
      color: white;
    }

    .primary:hover {
      background-color: #0d9488;
    }

    .secondary {
      background-color: ${unsafeCSS(colors.text)};
      color: #1f2937;
    }

    .secondary:hover {
      background-color: #d1d5db;
    }

    .small {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    .medium {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
    }

    .large {
      padding: 1rem 2rem;
      font-size: 1.125rem;
    }
  `;

  @property({ type: String })
  label = 'Button';

  @property({ type: Boolean })
  primary = false;

  @property({ type: String })
  size: 'small' | 'medium' | 'large' = 'medium';

  private _handleClick() {
    this.dispatchEvent(
      new CustomEvent('design-click', {
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const classes = [this.primary ? 'primary' : 'secondary', this.size].join(' ');

    return html` <button class=${classes} @click=${this._handleClick}>${this.label}</button> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'design-button': DesignButton;
  }
}
