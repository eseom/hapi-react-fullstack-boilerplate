import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import { reducer as form } from 'redux-form'

import auth from './modules/auth'
import counter from './modules/counter'
import info from './modules/info'
import items from './modules/items'

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  form,
  counter,
  info,
  items,
})
