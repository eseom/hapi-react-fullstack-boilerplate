import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import { reducer as form } from 'redux-form'
import { reducer as hapines } from './react-hapines'

import auth from './modules/auth'
import counter from './modules/counter'
import info from './modules/info'
import items from './modules/items'

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  hapines,
  auth,
  form,
  counter,
  info,
  items,
})
