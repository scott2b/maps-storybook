import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['./*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@chromatic-com/storybook', '@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  refs: {
    svelte: {
      title: 'Svelte',
      url: 'http://localhost:6006',
    },
    react: {
      title: 'React',
      url: 'http://localhost:6007',
    },
    'web-components': {
      title: 'Web Components',
      url: 'http://localhost:6008',
    },
  },
};

export default config;
