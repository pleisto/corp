module.exports = {
  plugins: [
    // stylelint is not compatible with postcss 8
    // require('stylelint')({}),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-preset-env')({
      stage: 1
    }),
    require('postcss-will-change'),
    require('autoprefixer')
  ]
}
