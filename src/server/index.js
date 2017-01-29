// @flow
/* eslint global-require: "off" */

import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import { match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import createHistory from 'react-router/lib/createMemoryHistory';
import { Provider } from 'react-redux';
import fs from 'fs';
import path from 'path';

import createStore from '../redux/create';
import ApiClient from '../helpers/ApiClient';
import Html from '../helpers/Html';
import getRoutes from '../routes';
import logger from '../logger';
import server from './server';

const pretty = new PrettyError();

server.route({
  method: '*',
  path: '/{p*}',
  handler: (request, reply) => {
    /**
     * static
     */
    if (request.path !== '/') {
      const fPath = path.resolve(`${__dirname}/../../static/${request.path}`);
      try {
        if (fs.statSync(fPath)) {
          return reply.file(fPath);
        }
      } catch (e) {
        /* empty */
      }
    }

    if (DEVELOPMENT) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      webpackIsomorphicTools.refresh();
    }
    const client = new ApiClient(request);
    const memoryHistory = createHistory(request.path);
    const store = createStore(memoryHistory, client);
    const history = syncHistoryWithStore(memoryHistory, store);

    function hydrateOnClient() {
      return reply(`<!doctype html>${ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store} />)}`);
    }

    if (DISABLE_SSR) {
      return hydrateOnClient();
    }

    return match({
      history,
      routes: getRoutes(store),
      location: request.path,
    }, (error, redirectLocation, renderProps) => {
      if (redirectLocation) {
        reply.redirect(redirectLocation.pathname + redirectLocation.search);
      } else if (error) {
        logger.error('ROUTER ERROR:', pretty.render(error));
        hydrateOnClient().code(500);
      } else if (renderProps) {
        loadOnServer({ ...renderProps, store, helpers: { client } }).then(() => {
          const component = (
            <Provider store={store} key="provider">
              <ReduxAsyncConnect {...renderProps} />
            </Provider>
          );
          global.navigator = { userAgent: request.headers['user-agent'] };
          reply(`<!doctype html>${ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store} />)}`);
        });
      } else {
        reply('Not Found').code(404);
      }
    });
  },
});

server.start((err) => {
  if (err) throw err;
  logger.info(`✅  server has started at ${server.info.uri}`);
});
