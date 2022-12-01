const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const stateBuild = process.env.NODE_ENV === 'state';

dotenv.config();

const config = {
  mode: 'production',
  target: 'web',
  devtool: 'source-map',
  entry: ['core-js/stable', 'regenerator-runtime/runtime', './client/index.js'],
  output: {
    publicPath: '/assets',
    path: path.resolve(__dirname, 'build/public'),
    filename: 'bundle/main.[hash].js',
    chunkFilename: 'bundle/[name].[hash].js',
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules\/(?!(swiper|dom7)\/).*/, /\.test\.js(x)?$/],
        use: ['babel-loader'],
      },
      {
        test: /\.(png|svg|jpg)$/,
        loader: 'file-loader?name=/images/[name].[ext]',
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=/fonts/[name].[ext]',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')],
            },
          },
          {
            loader: require.resolve('sass-loader'),
            options: {
              data: '@import "variable"; @import "mixin";',
              includePaths: [path.join(__dirname, './client/styles')],
            },
          },
        ],
      },
      {
        include: path.resolve('node_modules', 'lodash'),
        sideEffects: false,
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle/main.[hash].css',
      chunkFilename: 'bundle/[name].[hash].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'index.html',
      filename: 'bundle/index.html',
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'creditCardFrame.html',
      filename: 'bundle/creditCardFrame.html',
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        API_URL: JSON.stringify(process.env.API_URL),
        ENV: JSON.stringify(process.env.ENV || 'dev'),
      },
    }),
    new MomentLocalesPlugin({
      localesToKeep: ['es-us'],
    }),
    new CopyPlugin([{ from: 'public', to: '' }]),
    ...(stateBuild ? [new BundleAnalyzerPlugin()] : []),
  ],
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
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
    child_process: 'empty',
  },
};

module.exports = config;
