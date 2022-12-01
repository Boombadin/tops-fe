const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

dotenv.config();

const config = {
  mode: 'development',
  target: 'web',
  devtool: 'cheap-source-map',
  entry: ['core-js/stable', 'regenerator-runtime/runtime', './client/index.js'],
  output: {
    publicPath: '/assets',
    path: path.resolve(__dirname, 'build/public'),
    filename: 'bundle/main.[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules\/(?!(swiper|dom7)\/).*/, /\.test\.js(x)?$/],
        use: ['babel-loader']
      },
      {
        test: /\.(png|svg|jpg)$/,
        loader: 'file-loader?name=/images/[name].[ext]'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=/fonts/[name].[ext]'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            // options: {
            //   hmr: true,
            //   reloadAll: true
            // },
          },
          'css-loader',
          {
            loader: require.resolve('sass-loader'),
            options: {
              sourceMap: true,
              data: '@import "variable"; @import "mixin";',
              includePaths: [path.join(__dirname, './client/styles')]
            }
          }
        ],
      },
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(),
    // define env
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        API_URL: JSON.stringify(process.env.API_URL),
        ENV: JSON.stringify(process.env.ENV || 'dev')
      }
    }),
    // bundle css
    new MiniCssExtractPlugin({
      filename: 'bundle/style.[hash].css',
    }),
    // create index.html and inject script from index.html template
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'index.html',
      filename: 'bundle/index.html',
      // alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'creditCardFrame.html',
      filename: 'bundle/creditCardFrame.html',
      // alwaysWriteToDisk: true
    }),
    // new HtmlWebpackHarddiskPlugin(),
    // load only locale es-us for moment js
    new MomentLocalesPlugin({
      localesToKeep: ['es-us'],
    }),
    new CopyPlugin([
      { from: 'public', to: '' },
    ]),
    // enable hot reload
    // new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 1,
        },
      },
    },
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};

module.exports = config;
