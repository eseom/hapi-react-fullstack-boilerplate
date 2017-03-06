import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import { info } from './modules/info'

export const reducers = combineReducers({
  reduxAsyncConnect,
  routing: routerReducer,
  info,
})
