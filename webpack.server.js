const path = require('path');
const dotenv = require('dotenv');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

dotenv.config();

const reStyle = /\.(css|less|styl|scss|sass|sss)$/;
const reImage = /\.(bmp|gif|jpg|jpeg|png|svg)$/;

const config = {
  name: 'app',
  mode: 'production',
  target: 'node',
  devtool: 'source-map',
  entry: ['core-js/stable', 'regenerator-runtime/runtime', './app/index.js'],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: info =>
    path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
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
          'css-loader',
          {
            loader: require.resolve('sass-loader'),
            options: {
              data: '@import "variable"; @import "mixin";',
              includePaths: [path.join(__dirname, './client/styles')],
            },
          },
        ],
      },
    ],
  },
  plugins: [new CopyPlugin([{ from: 'app/views', to: 'views' }])],
  externals: [
    nodeExternals({
      whitelist: [reStyle, reImage],
    }),
  ],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
};

module.exports = config;
