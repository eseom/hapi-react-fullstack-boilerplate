import { combineReducers } from 'redux'
import { reducer as info } from './modules/info'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import { routerReducer } from 'react-router-redux'

const reducers = combineReducers({
  reduxAsyncConnect,
  routing: routerReducer,
  info,
})

export {
  reducers
}
