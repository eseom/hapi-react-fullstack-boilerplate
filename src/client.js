import React from 'react'
import io from 'socket.io-client'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { ReduxAsyncConnect } from 'redux-connect'
import { syncHistoryWithStore } from 'react-router-redux'
import useScroll from 'scroll-behavior/lib/useStandardScroll'

import { ApiClient } from './helpers/ApiClient'
import { getRoutes } from './routes'
import { configureStore } from './redux/store'

const client = new ApiClient()
const bHistory = useScroll(() => browserHistory)()
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

// global.socket = initSocket()

const Root = () => (
  <div>
    <Provider store={store}>
      <Router
        render={props => <ReduxAsyncConnect {...props} helpers={{ client }} />}
        filter={item => !item.deferred}
        history={history}
        key={Math.random()}
      >
        {getRoutes()}
      </Router>
    </Provider>
  </div>
)

const bootstrap = (Component) => {
  render(
    <Component />,
    document.getElementById('root'),
  )
}

bootstrap(Root)

if (module.hot) {
  module.hot.accept('./containers/App/App', () => {
    bootstrap(Root)
  })
}
