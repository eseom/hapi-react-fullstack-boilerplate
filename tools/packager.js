/* eslint import/no-extraneous-dependencies: ["error", {"optionalDependencies": false}] */

import Hapi from 'hapi'
import webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'

import { resolve } from 'path'

const webpackConfig = {
  entry: [
    // 'react-hot-loader/patch',
    'webpack-hot-middleware/client?path=http://localhost:3001/__webpack_hmr&timeout=2000&overlay=false',
    // 'webpack/hot/only-dev-server',
    './client.js',
  ],
  output: {
    filename: 'bundle.js',
    // the output bundle
    // path: resolve(__dirname, 'dist'),
    publicPath: 'http://localhost:3001/',
    // necessary for HMR to know where to load the hot update chunks
  },

  context: resolve(__dirname, '..', 'src'),
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader?modules',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('postcss-smart-import')({ /* ...options */ }),
                require('postcss-nested'),
                require('precss')({ /* ...options */ }),
                require('autoprefixer')({ /* ...options */ }),
              ],
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      DEVELOPMENT: JSON.stringify(true),
      CLIENT: JSON.stringify(true),
      SERVER: JSON.stringify(false),
    }),
  ],
}
const compiler = webpack(webpackConfig)

const server = new Hapi.Server()
const host = 'localhost'
const port = 3001

server.connection({
  host,
  port,
})

const dMiddleware = WebpackDevMiddleware(compiler, {
  // noInfo: false,
  quiet: true,
  // lazy: true,
  // watchOptions: {
  //   aggregateTimeout: 300,
  //   poll: true,
  // },
  // headers: { 'X-Custom-Header': 'yes' },
  // stats: {
  //   colors: true,
  // },
  // reporter: null,
  // serverSideRender: false,
})
const hMiddleware = WebpackHotMiddleware(compiler)

server.ext('onRequest', (request, reply) => {
  const { req, res } = request.raw
  dMiddleware(req, res, (err) => {
    if (err) {
      return reply(err)
    }
    return reply.continue()
  })
})

server.ext('onRequest', (request, reply) => {
  const { req, res } = request.raw
  hMiddleware(req, res, (err) => {
    if (err) {
      return reply(err)
    }
    return reply.continue()
  })
})

server.start()
