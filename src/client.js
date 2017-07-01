// @flow
/* eslint no-console: "off" */

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { ReduxAsyncConnect } from 'redux-connect'
import useScroll from 'scroll-behavior/lib/useStandardScroll'

import { configureStore } from './redux/configureStore'
import ApiClient from './helpers/ApiClient'
import getRoutes from './routes'
import { connect as connectNes } from './redux/react-hapines'

const client = new ApiClient()
const bHistory = useScroll(() => browserHistory)()
const dest = document.getElementById('content')
const store = configureStore(bHistory, client, window.processedStore)
const history = syncHistoryWithStore(bHistory, store)

const wsUrl = `ws${window.location.protocol === 'https:' ? 's' : ''}://${window.location.host}`
global.socket = connectNes(store, wsUrl)

const RootComponent = () => (
  <Provider store={store} key="provider">
    <Router
      render={props =>
        <ReduxAsyncConnect {...props} helpers={{ client }} filter={item => !item.deferred} />
      }
      history={history}
    >
      {getRoutes(store)}
    </Router>
  </Provider>
)

ReactDOM.render(
  <RootComponent />,
  dest,
)

if (DEVELOPMENT && module.hot) {
  module.hot.accept(() => {
    ReactDOM.render(
      <RootComponent />,
      dest,
    )
  })
}
