const CleanWebpackPlugin = require('clean-webpack-plugin');
const TohoLogPlugin = require('toho-log-plugin');
const {
  commonModule,
  commonPlugin,
  resolveModule,
} = require('../webpack/commonConfig');
const { getProjectPath } = require('../babel/projectHelper.js');
const merge = require('webpack-merge');

// maybe there is a bug
// getProjectPath('dist/lib/main')
// this can't release entry file to correct place
const defaultOutput = 'dist';

const getDefaultWebpackConfig = program => {
  const dev = !!program.dev;
  const config = {
    mode: dev ? 'development' : 'production',
    resolve: resolveModule,
    devtool: dev ? 'source-map' : '',
    entry: {
      ninoninoni: getProjectPath('src'),
    },
    output: {
      path: getProjectPath(defaultOutput),
      filename: '[name].js',
      chunkFilename: 'vendor/[name].js',
    },
    plugins: [
      ...commonPlugin,
      new TohoLogPlugin({ dev, isPray: false }),
      new CleanWebpackPlugin({
        root: getProjectPath(),
        verbose: false,
      }),
    ],
    module: commonModule,
  };

  return config;
};

const getDefaultConfig = program => {
  let configFile = program.config;
  let webpackConfig = {};
  const config = getDefaultWebpackConfig(program);

  if (configFile) {
    configFile = getProjectPath(program.config);
    // fs.existsSync(configFile)
    const customizedConfig = require(configFile);
    if (!customizedConfig) {
      throw Error('check nino.koei.js, there is something wrong with it.');
    }
    webpackConfig = merge(config, customizedConfig);
  } else {
    // defaultWebpackConfig.output.path = program.output || defaultOutput;
    webpackConfig = config;
  }

  return { webpackConfig };
};

module.exports = { getDefaultConfig, getDefaultWebpackConfig };
