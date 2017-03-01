import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import * as createHistory from 'react-router/lib/createMemoryHistory'
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect'
import { match, RouterContext } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import * as WebpackIsomorphicTools from 'webpack-isomorphic-tools'
import { isomorphicConfig } from '../webpack/isomorphic-tools'

import { Html } from './containers/App/Html'

import { configureStore } from './redux/configureStore'
import { getRoutes } from './routes'
import { getServer } from './server/core'
import {ApiClient} from './helpers/ApiClient'

const webpackIsomorphicTools = new WebpackIsomorphicTools(isomorphicConfig)

webpackIsomorphicTools.server(`${__dirname}/..`, async () => {

  const server = await getServer()

  server.route({
    path: '/static/{p*}',
    method: 'get',
    handler: (request, reply) => {
      /* tslint:disable:no-string-literal */
      reply.file(`${__dirname}/../static/${request.params['p']}`)
      /* tslint:enable:no-string-literal */
    },
  })

  server.route({
    path: '/{p*}',
    method: 'get',
    handler: (request, reply) => {
      if (process.env.NODE_ENV !== 'production') {
        webpackIsomorphicTools.refresh()
      }

      const memoryHistory = createHistory(request.url.path)
      const client = new ApiClient(request)
      const store = configureStore(memoryHistory, client)
      const history = syncHistoryWithStore(memoryHistory, store)

      function hydrateOnClient() {
        return reply(`<!doctype html>${renderToString(
          <Html
            assets={webpackIsomorphicTools.assets()}
            store={store}
          />,
        )}`)
      }

      const routes = getRoutes(store)

      match({ history, routes, location: request.url.path }, (error, redirectLocation, renderProps) => {
        if (error) {
          console.error('ROUTER ERROR:', error)
          hydrateOnClient().code(500)
        } else if (redirectLocation) {
          reply.redirect(redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
          loadOnServer({ ...renderProps, store }).then(() => {
            try {
              const component = (
                <Provider store={store}>
                  <ReduxAsyncConnect {...renderProps} />
                  {/*<RouterContext {...renderProps} />*/}
                </Provider>
              )
              reply(`<!doctype html>${renderToString(
                <Html
                  assets={webpackIsomorphicTools.assets()}
                  component={component}
                  store={store}
                />,
              )}`)
            } catch (e) { console.error(e, e.stack) }
          })
        } else {
          reply('Not Found').code(404)
        }
      })
    },
  })

  server.start()

  console.log(`✅  server has started at ${server.info.uri}.`)
})
