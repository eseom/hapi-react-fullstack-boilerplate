/* eslint no-console: "off" */

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { ReduxAsyncConnect } from 'redux-async-connect'
import useScroll from 'scroll-behavior/lib/useStandardScroll'

import { configureStore } from './redux/configureStore'
import ApiClient from './helpers/ApiClient'
import getRoutes from './routes'

const client = new ApiClient()
const bHistory = useScroll(() => browserHistory)()
const dest = document.getElementById('content')
const store = configureStore(bHistory, client, window.processedStore)
const history = syncHistoryWithStore(bHistory, store)

function initSocket() {
  const socket = io('', { path: '/ws' })
  socket.on('news', (data) => {
    console.debug(data)
    socket.emit('my other event', { my: 'data from client' })
  })
  socket.on('msg', (data) => {
    console.debug(data)
  })
  socket.on('disconnect', () => {
    socket.disconnect()
    global.socket = null
  })

  return socket
}

global.socket = initSocket()

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

if (process.env.NODE_ENV !== 'production') {
  window.React = React // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.')
  }
}
