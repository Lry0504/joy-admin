/* Custom webpack configuration */

const CracoLessPlugin = require('craco-less');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyvars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          }
        }
      }
    },
    new AntdDayjsWebpackPlugin(),
  ]
}