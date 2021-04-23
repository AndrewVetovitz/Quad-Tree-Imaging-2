const { addBeforeLoader, loaderByName } = require('@craco/craco');
const path = require('path');

const wasmExtensionRegExp = /\.wasm$/;

/*
  const wasmExtensionRegExp = /\.wasm$/;

  config.resolve.extensions.push('.wasm');

  config.module.rules.forEach(rule => {
    (rule.oneOf || []).forEach(oneOf => {
      if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
        // make file-loader ignore WASM files
        oneOf.exclude.push(wasmExtensionRegExp);
      }
    });
  });

  // add a dedicated loader for WASM
  config.module.rules.push({
    test: wasmExtensionRegExp,
    include: path.resolve(__dirname, 'src'),
    use: [{ loader: require.resolve('wasm-loader'), options: {} }]
  });

  return config;
*/

module.exports = {
  webpack: {
    // Make file-loader ignore WASM files
    configure: (webpackConfig) => {
      webpackConfig.resolve.extensions.push('.wasm');

      webpackConfig.module.rules.forEach((rule) => {
        (rule.oneOf || []).forEach((oneOf) => {
          if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
            oneOf.exclude.push(wasmExtensionRegExp);
          }
        });
      });

      webpackConfig.module.rules.push({
        test: wasmExtensionRegExp,
        include: path.resolve(__dirname, 'src'),
        use: [{ loader: require.resolve('wasm-loader'), options: {} }]
      });

    // // Add a dedicated loader for WASM
    //   const wasmLoader = {
    //     test: wasmExtensionRegExp,
    //     exclude: /node_modules/,
    //     loaders: ['wasm-loader'],
    //   };

    //   addBeforeLoader(webpackConfig, loaderByName('file-loader'), wasmLoader);

      return webpackConfig;
    }
  }
};
