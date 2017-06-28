/* eslint import/no-extraneous-dependencies: "off" */
/* eslint-disable no-console */

const webpack = require('webpack')
const Hapi = require('hapi')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.development')

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

console.log(`🚧  webpack packager has started at ${server.info.uri}`)
