import type { StorybookConfig } from '@storybook/svelte-vite';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|ts|svelte)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/svelte-vite',
    options: {
      docgen: false,
    },
  },
  async viteFinal(config) {
    const existingSveltePlugin = config.plugins?.find(
      (plugin) =>
        plugin &&
        typeof plugin === 'object' &&
        'name' in plugin &&
        plugin.name === 'vite-plugin-svelte'
    );

    if (!existingSveltePlugin) {
      config.plugins?.push(
        svelte({
          preprocess: vitePreprocess(),
          compilerOptions: {},
        })
      );
    }

    return mergeConfig(config, {
      test: {
        include: ['**/*.test.ts'],
      },
    });
  },
};

export default config;
