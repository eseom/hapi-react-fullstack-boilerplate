/* eslint global-require: "off" */

import { createStore as _createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createMiddleware from './middleware/clientMiddleware'

export const configureStore = (history, client, data) => {
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = routerMiddleware(history)

  const middleware = [createMiddleware(client), reduxRouterMiddleware, thunk]

  let finalCreateStore
  if (DEVELOPMENT && CLIENT) {
    finalCreateStore = compose(
      applyMiddleware(...middleware),
    )(_createStore)
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore)
  }

  const reducers = require('./reducers')
  // remove pagination
  // if (data) {
  //   data.pagination = Immutable.fromJS(data.pagination)
  // }
  const store = finalCreateStore(reducers, data)

  if (DEVELOPMENT && module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers'))
    })
  }

  return store
}
