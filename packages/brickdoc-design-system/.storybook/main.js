const path = require('path')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-addon-designs',
    '@storybook/addon-a11y',
    '@pxblue/storybook-rtl-addon/register'
  ],
  framework: '@storybook/react',
  core: {
    builder: 'storybook-builder-vite'
  },
  refs: {
    '@chakra-ui/react': {
      disable: true
    }
  },
  features: {
    emotionAlias: false
  },
  /**
   * Monkey patching the emotion to fix storybook-builder-vite issue
   * @see https://github.com/eirslett/storybook-builder-vite/issues/219
   */
  async viteFinal(config) {
    // yarn workspace root
    const dir = '../../../node_modules'
    config.resolve.alias = {
      ...config.resolve.alias,
      '@emotion/react': path.resolve(path.join(__dirname, dir, '@emotion/react')),
      '@emotion/styled': path.resolve(path.join(__dirname, dir, '@emotion/styled')),
      '@emotion/core': path.resolve(path.join(__dirname, dir, '@emotion/react')),
      'emotion-theming': path.resolve(path.join(__dirname, dir, '@emotion/react'))
    }
    return config
  }
}
