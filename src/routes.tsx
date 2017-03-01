import * as React from 'react'
import { IndexRoute, Route } from 'react-router'

import { App } from './containers/App/App'
import { Home } from './containers/Home/Home'
import { Login } from './containers/Login/Login'

const LoginSuccess = (
  <div>LoginSuccess</div>
)

const NotFound = (
  <div>NotFound</div>
)

export const getRoutes = (store) => {
  const requireLogin = (nextState, replace, cb) => {
    //   function checkAuth() {
    //     const { auth: { user } } = store.getState()
    //     if (!user) {
    //       // oops, not logged in, so can't be here!
    //       replace('/')
    //     }
    //     cb()
    //   }

    //   if (!isAuthLoaded(store.getState())) {
    //     store.dispatch(loadAuth()).then(checkAuth)
    //   } else {
    //     checkAuth()
    //   }
  }

  return (
    <div>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="login" component={Login} />
      </Route>
    </div>
  )
}
