import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { ReduxAsyncConnect } from 'redux-connect'
import { Provider } from 'react-redux'

import { App } from './containers/App/App'

import { configureStore } from './redux/configureStore'
import { getRoutes } from './routes'
import { ApiClient } from './helpers/ApiClient'

const dest = document.getElementById('content')
const client = new ApiClient()
const store = configureStore(browserHistory, client, window.processedStore)
const history = syncHistoryWithStore(browserHistory, store)

const connectedCmp = (props) => <ReduxAsyncConnect {...props} />

const RootComponent = (renderProps) => (
  <Provider store={store}>
    <Router
      render={connectedCmp}
      routes={getRoutes(store)}
      history={history}
      {...renderProps}
    />
  </Provider>
)

ReactDOM.render(
  <RootComponent />,
  dest,
)

if (process.env.NODE_ENV !== 'production') {
  if ((module as any).hot) {
    (module as any).hot.accept('./redux/reducers', () => {
      /* tslint:disable */
      store.replaceReducer(require('./redux/reducers').reducers)
      /* tslint:enable */
    });
    (module as any).hot.accept(() => {
      ReactDOM.render(
        <RootComponent />,
        dest,
      )
    })
  }
}
