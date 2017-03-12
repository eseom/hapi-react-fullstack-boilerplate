/* eslint import/no-extraneous-dependencies: "off" */

import webpack from 'webpack'
import Hapi from 'hapi'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from './webpack.development'
import logger from '../src/server/logger'

const compiler = webpack(webpackConfig)
const host = 'localhost'
const port = 3001
const serverOptions = {
  contentBase: `http://${host}:${port}`,
  quiet: true,
  noInfo: false,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true },
}

const server = new Hapi.Server()
const devMiddleware = webpackDevMiddleware(compiler, serverOptions)
const hotMiddleware = webpackHotMiddleware(compiler)

server.app.webpackCompiler = compiler // eslint-disable-line no-param-reassign

server.connection({
  host,
  port,
})

server.ext('onRequest', (request, reply) => {
  const req = request.raw.req
  const res = request.raw.res
  devMiddleware(req, res, (err) => {
    if (err) return reply(err)
    return reply.continue()
  })
})

server.ext('onRequest', (request, reply) => {
  const req = request.raw.req
  const res = request.raw.res
  hotMiddleware(req, res, (err) => {
    if (err) return reply(err)
    return reply.continue()
  })
})

server.start()

logger.info(`🚧  webpack packager has started at ${server.info.uri}`)
