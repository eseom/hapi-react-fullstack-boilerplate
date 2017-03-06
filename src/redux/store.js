import thunk from 'redux-thunk'
import { createStore as _createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { clientMiddleware } from './middlewares/clientMiddleware'

export const configureStore = (history, client, data) => {
  const reduxRouterMiddleware = routerMiddleware(history)

  const middleware = [clientMiddleware(client), reduxRouterMiddleware, thunk]

  let finalCreateStore
  if (DEVELOPMENT && CLIENT) {
    finalCreateStore = compose(
      applyMiddleware(...middleware),
    )(_createStore)
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore)
  }

  const reducers = require('./reducers').reducers
  const store = finalCreateStore(reducers, data)

  if (DEVELOPMENT && module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers').reducers)
    })
  }

  return store
}
