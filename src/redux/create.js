/* eslint global-require: "off" */

import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createMiddleware from './middleware/clientMiddleware';

export default function createStore(history, client, data) {
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = routerMiddleware(history);

  const middleware = [createMiddleware(client), reduxRouterMiddleware, thunk];

  let finalCreateStore;
  if (DEVELOPMENT && CLIENT) {
    finalCreateStore = compose(
      applyMiddleware(...middleware),
    )(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  const reducer = require('./modules/reducer');
  // remove pagination
  // if (data) {
  //   data.pagination = Immutable.fromJS(data.pagination);
  // }
  const store = finalCreateStore(reducer, data);


  if (DEVELOPMENT && module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'));
    });
  }

  return store;
}
