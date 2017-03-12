// @flow

import Path from 'path'
import webpack from 'webpack'
import logger from '../src/server/logger'

const assetsPath = Path.resolve(__dirname, '../static/dist')
const host = 'localhost'
const port = process.env.NODE_ENV || 3001

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin')
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./isomorphic-tools'))

let babelrcObject = {}

try {
  babelrcObject = require('../package.json').babel
} catch (err) {
  logger.error('==>     ERROR: Error parsing your babel.json.')
  logger.error(err)
}

let babelConfig = {}
if (babelrcObject.env) {
  babelConfig = babelrcObject.env.development
}

export default {
  devtool: 'inline-source-map',
  context: Path.resolve(__dirname, '..'),
  entry: {
    main: [
      `webpack-hot-middleware/client?path=http://${host}:${port}/__webpack_hmr`,
      // 'bootstrap-sass!./src/theme/bootstrap.config.js',
      // 'font-awesome-webpack!./src/theme/font-awesome.config.js',
      './src/client.js',
    ],
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: `http://${host}:${port}/dist/`,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelConfig,
          },
          'eslint-loader',
        ],
      },
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /Html\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        exclude: /Html\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: true,
            },
          },
        ],
      },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=image/svg+xml' },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        use: 'url-loader?limit=10240',
      },
    ],
  },
  resolve: {
    modules: [
      'src',
      'node_modules',
    ],
    extensions: ['.json', '.js', '.jsx'],
  },
  plugins: [
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      CLIENT: true,
      SERVER: false,
      DEVELOPMENT: true,
    }),
    webpackIsomorphicToolsPlugin.development(),
  ],
}
