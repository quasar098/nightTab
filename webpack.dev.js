const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    watchFiles: ['src/**/*'],
    client: {
      logging: 'verbose', // Full HMR log in the browser console
      overlay: true, // Show errors as a browser overlay
    },
    static: {
      watch: true, // Watches static files (optional)
    },
  }
});
