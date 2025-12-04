<script lang="ts">
  import type { CardProps } from '@design/ui-core';
  import { colors } from '@design/ui-core';

  let {
    title = '',
    description = '',
    variant = 'default',
    clickable = false,
    onclick,
  }: CardProps & { onclick?: () => void } = $props();

  // eslint-disable-next-line no-undef
  function handleKeyDown(e: KeyboardEvent) {
    if (clickable && onclick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onclick();
    }
  }
</script>

<div
  class="card"
  class:clickable
  class:variant-default={variant === 'default'}
  class:variant-elevated={variant === 'elevated'}
  class:variant-outlined={variant === 'outlined'}
  role={clickable ? 'button' : 'article'}
  tabindex={clickable ? 0 : undefined}
  {onclick}
  onkeydown={handleKeyDown}
  style="--surface-color: {colors.surface}; --text-color: {colors.text}"
>
  {#if title}
    <h3 class="card-title">{title}</h3>
  {/if}
  {#if description}
    <p class="card-description">{description}</p>
  {/if}
  <slot />
</div>

<style>
  .card {
    background-color: var(--surface-color, #020617);
    border-radius: 0.5rem;
    padding: 1.5rem;
    transition: all 0.2s ease;
    color: var(--text-color, #e5e7eb);
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
    color: var(--text-color, #e5e7eb);
  }

  .card-description {
    font-size: 0.875rem;
    color: var(--text-color, #e5e7eb);
    opacity: 0.8;
    line-height: 1.5;
    margin: 0;
  }
</style>
