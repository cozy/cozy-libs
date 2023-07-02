import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-react-router-v6"
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: true
  },
  staticDirs: ['./public'],
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "stream": require.resolve("stream-browserify")
    }
  
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "cozy-keys-lib": require.resolve('./__mocks__/cozy-keys-lib.ts'),
      "cozy-flags": require.resolve('./__mocks__/cozy-flags.ts'),
    }

    return config;
  },
};

export default config;