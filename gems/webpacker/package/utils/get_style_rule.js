/* eslint global-require: 0 */
const { moduleExists } = require('./helpers')
const inliningCss = require('../inliningCss')

const getStyleRule = (test, preprocessors = []) => {
  if (moduleExists('css-loader')) {

    // style-loader is required when using css modules with HMR on the webpack-dev-server

    const use = [
      inliningCss ? 'style-loader' : require('mini-css-extract-plugin').loader,
      {
        loader: require.resolve('css-loader'),
        options: {
          sourceMap: true,
          importLoaders: 2
        }
      },
      {
        loader: require.resolve('postcss-loader'),
        options: { sourceMap: true }
      },
      ...preprocessors
    ].filter(Boolean)

    return {
      test,
      use
    }
  }

  return null
}

module.exports = getStyleRule
