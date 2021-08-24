require('ts-node').register({
  transpileOnly: true,
  transpiler: 'ts-node/transpilers/swc-experimental',
  compilerOptions: { module: 'commonjs' }
});
const { mixins } = require('@brickdoc/design-system/components/style/mixins/jsMixins.ts')
module.exports = {
  plugins: [
    // stylelint is not compatible with postcss 8
    // require('stylelint')({}),
    require('postcss-mixins')({ mixins }),
    require('postcss-simple-vars'),
    require('postcss-preset-env')({
      stage: 1
    }),
    require('postcss-will-change'),
    require('autoprefixer')
  ]
}
