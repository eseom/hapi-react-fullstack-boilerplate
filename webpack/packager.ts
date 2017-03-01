// webpack
import * as webpack from 'webpack'
import * as wpDevMiddleware from 'webpack-dev-middleware'
import * as wpHotMiddleware from 'webpack-hot-middleware'
import { webpackConfig } from './development'

// hapi
import * as Hapi from 'hapi'

// prepare hapi
const packager = new Hapi.Server()
const host = 'localhost'
const port = 3001
packager.connection({
  host,
  port,
})

// prepare webpack
const compiler = webpack(webpackConfig)
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
packager.app.webpackCompiler = compiler

const devMiddleware = wpDevMiddleware(compiler, serverOptions)
const hotMiddleware = wpHotMiddleware(compiler)

// set middleware to hapi
packager.ext('onRequest', (request, reply) => {
  const {req, res} = request.raw
  devMiddleware(req, res, (err) => {
    if (err) { return reply(err) }
    reply.continue()
  })
})
packager.ext('onRequest', (request, reply) => {
  const {req, res} = request.raw
  hotMiddleware(req, res, (err) => {
    if (err) { return reply(err) }
    reply.continue()
  })
})

// start the packager on development 3001 port
packager.start()
console.log(`🚧   webpack packager has started at ${host}:${port}.`)
