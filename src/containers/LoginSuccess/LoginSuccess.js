import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import * as authActions from '../../redux/modules/auth'

@connect(
  state => ({ user: state.auth.user && state.auth.user.username ? state.auth.user : null }),
  authActions)
export default class LoginSuccess extends Component {
  static propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func,
  }

  render() {
    const { user, logout } = this.props
    if (!user) {
      return null
    }
    return (
      <div className="container-fluid">
        <h3>Login Success</h3>
        <div>
          <div className="alert alert-info">
            Hi, {user.username}. You have just successfully logged in,
            and were forwarded here
            by <code>componentWillReceiveProps()</code> in <code>App.js</code>,
            which is listening to
            the auth reducer via redux <code>@connect</code>. How exciting!
          </div>
          <p>
            The same function will forward you to <code>/</code> should
            you chose to log out. The choice is yours...
          </p>
          <div>
            <button className="btn btn-sm btn-default" onClick={logout}><i className="fa fa-signout" />{' '}Log Out</button>
          </div>
        </div>
      </div>
    )
  }
}
