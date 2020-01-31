const UglifyJsParallelPlugin = require('webpack-uglify-parallel');
const HappyPack = require('happypack');
const os = require('os');

const options = {
  workers: os.cpus().length,
  output: {
    ascii_only: true,
  },
  compress: {
    warnings: false,
  },
  sourceMap: false,
};

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

export default (webpackConfig, { webpack }) => {
  const isDev = process.env.NODE_ENV === 'development';
  const event = process.env.npm_lifecycle_event;
  let loaders = webpackConfig.module.rules[2].use;
  if (event === 'analyze') {
    loaders = webpackConfig.module.rules[3].use;
  }
  const newWebpackConfig = webpackConfig || {};
  if (!isDev) {
    newWebpackConfig.module.rules[2] = {
      test: /\.(js|jsx)$/,
      use: 'happypack/loader',
      exclude: [/node_modules/],
    };
    newWebpackConfig.plugins.push(
      new HappyPack({
        threadPool: happyThreadPool,
        loaders,
      }),
      new HappyPack({
        id: 'styles',
        threads: 2,
        loaders: ['css-loader', 'less-loader'],
      })
    );
    newWebpackConfig.plugins.some((plugin, i) => {
      if (plugin instanceof webpack.optimize.UglifyJsPlugin) {
        webpackConfig.plugins.splice(i, 1);
        return true;
      }
      return false;
    });
    newWebpackConfig.plugins.push(
      new UglifyJsParallelPlugin(options)
    );
  }
  return newWebpackConfig;
};
