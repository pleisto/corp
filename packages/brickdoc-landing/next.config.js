/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  pageExtensions: ['jsx', 'js', 'tsx', 'ts'],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack, dir }) => {
    // if (!defaultLoaders.babel.options.babelrc) {
    //   defaultLoaders.babel.options.presets.unshift("@babel/preset-typescript");
    // }

    // config.module.rules.push({
    //   test: /\.(ts|tsx)$/,
    //   include: [dir],
    //   exclude: /node_modules/,
    //   use: defaultLoaders.babel
    // });
    console.log('config.module.rules', config.module.rules)

    return config
  }
}
