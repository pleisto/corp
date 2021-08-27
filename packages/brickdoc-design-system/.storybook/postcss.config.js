require('ts-node').register({
  transpileOnly: true,
  transpiler: 'ts-node/transpilers/swc-experimental',
  compilerOptions: { module: 'commonjs' }
})
const { mixins } = require('../components/style/mixins/jsMixins.ts')
console.log(123, mixins)
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
