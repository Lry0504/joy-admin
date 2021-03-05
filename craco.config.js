/**
 * Custom webpack configuration
 * - whenDev: process.env.NODE_ENV === 'development'
 * - whenTest: process.env.NODE_ENV === 'test'
 * - whenProd: process.env.NODE_ENV === 'production'
 */

const { when, whenDev, whenProd } = require('@craco/craco');
const webpack = require('webpack');
const CracoAntDesignPlugin = require('craco-antd');
const CracoVtkPlugin = require('craco-vtk');
const CracoLessPlugin = require('craco-less');
const WebpackBar = require('webpackbar');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const DashBoardPlugin = require('webpack-dashboard/plugin');
// const ReactHotReloadPlugin = require('craco-plugin-react-hot-reload');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Determine whether the compilation environment is a production environment
const isBuildAnalyzer = process.env.BUILD_ANALYZER === 'true';

const pathResolve = pathUrl => path.join(__dirname, pathUrl);

const getProxyConfig = keys => {
  const proxyConfig = dotenv.parse(fs.readFileSync(pathResolve(__dirname, './proxy.env')));
  for (const key of keys) {
    if (proxyConfig[key]) {
      return proxyConfig[key];
    }
  }
}

const getPathRewriteFunc = (curPath, keys) => {
  return (path, req) => {
    const val = getProxyConfig(keys);
    if (!val) {
      return path;
    }
    return path.replace(curPath, val);
  }
}

module.exports = {
  webpack: {
    // Alias configuration
    // alias: {
    //   '@': pathResolve('.'),
    //   src: pathResolve('src'),
    //   api: pathResolve('src/api'),
    //   config: pathResolve('../config'),
    //   pages: pathResolve('src/pages'),
    //   assets: pathResolve('src/assets'),
    //   components: pathResolve('src/components'),
    //   services: pathResolve('src/services'),
    //   utils: pathResolve('src/utils'),
    //   store: pathResolve('src/store'),
    //   router: pathResolve('src/router'),
    //   hooks: pathResolve('src/hooks')
    // },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // The time conversion tool replace moment with day
      new AntdDayjsWebpackPlugin(),
      // Add module cyclic dependency detection plug-in
      ...whenDev(
        () => [
          new CircularDependencyPlugin({
            exclude: /node_modules/,
            include: /src/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: process.cwd()
          }),
          // webpack dev server enhancement plug-in
          new DashBoardPlugin(),
          new webpack.HotModuleReplacementPlugin()
        ],
        []
      ),
      // Add package product analysis plug-in
      ...when(
        isBuildAnalyzer, () => [
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: path.resolve(__dirname, 'analyzer/index.html')
          })
        ],
        []
      ),
      ...whenProd(
        () => [
          // Webpack build progress bar
          new WebpackBar({
            profile: true
          }),
          // View the progress of the packaging
          new SimpleProgressWebpackPlugin(),
          new TerserPlugin({
            sourceMap: true,
            terserOptions: {
              ecma: undefined,
              parse: {},
              compress: {
                warnings: false,
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log']
              }
            }
          }),
          new CompressionWebpackPlugin({
            algorithm: 'gzip',
            test: new RegExp('\\.(' + ['js', 'css', 'tsx', 'ts', 'less'].join('|') + ')$'),
            threshold: 1024,
            minRatio: 0.8
          })
        ],
        []
      )
    ],
    // Extract common module
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0
          },
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            priority: 10,
            enforce: true
          }
        }
      }
    },
    // wtire any configuration of webpack
    configure: (webpackConfig, { env, paths }) => {
      paths.appBuild = 'dist';
      webpackConfig.output = {
        ...webpackConfig.output,
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
      };
      return webpackConfig;
    }
  },
  babel: {
    presets: [],
    plugins: [
      // Ant Design on demand loading
      [
        'import',
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true
        },
        'antd'
      ],
      // use to support decorotors
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true
        }
      ]
    ],
    loaderOptions: {},
    loaderOptions: (babelLoaderOptions, { env, paths }) => { return babelLoaderOptions }
  },
  // Add plugins provided by craco
  plugins: [
    ...whenDev(
      () => [
        // {
        //   plugin: ReactHotReloadPlugin
        // },
        {
          plugin: CracoVtkPlugin()
        },
        {
          plugin: new AntdDayjsWebpackPlugin()
        }
      ],
      []
    ),
    // Ant Design theme configure
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeThemeLessPath: path.join(__dirname, 'antd.customize.less')
      }
    }
  ],
  devServer: {
    port: 2021,
    proxy: {
      '/api': {
        target: '',
        changeOrigin: true,
        secure: false,
        xfwd: false,
        pathRewrite: getPathRewriteFunc('/api', ['API_PATH_REWRITE']),
        router: () => getProxyConfig(['API-TARGET', 'TARGET'])
      }
    }
  }
}