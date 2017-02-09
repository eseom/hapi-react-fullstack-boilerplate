/* eslint import/no-extraneous-dependencies: "off" */

import webpack from 'webpack';
import Hapi from 'hapi';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.config.development';
import logger from '../src/server/logger';

const compiler = webpack(webpackConfig);
const host = 'localhost';
const port = 3001;
const serverOptions = {
  contentBase: `http://${host}:${port}`,
  quiet: false,
  noInfo: false,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true },
};

const app = new Hapi.Server();
const devMiddleware = webpackDevMiddleware(compiler, serverOptions);
const hotMiddleware = webpackHotMiddleware(compiler);

app.app.webpackCompiler = compiler; // eslint-disable-line no-param-reassign

app.connection({
  host,
  port,
});

app.ext('onRequest', (request, reply) => {
  const req = request.raw.req;
  const res = request.raw.res;
  devMiddleware(req, res, (err) => {
    if (err) return reply(err);
    return reply.continue();
  });
});

app.ext('onRequest', (request, reply) => {
  const req = request.raw.req;
  const res = request.raw.res;
  hotMiddleware(req, res, (err) => {
    if (err) return reply(err);
    return reply.continue();
  });
});

app.start();

logger.info('🚧 webpack development server listening on port %s', port);
