import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Icon, Header, Button } from 'semantic-ui-react';

import * as authActions from '../../redux/modules/auth';

@connect(
  state => ({ user: state.auth.user && state.auth.user.username ? state.auth.user : null }),
  authActions)
export default class LoginSuccess extends Component {
  static propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func,
  }

  render() {
    const { user, logout } = this.props;
    if (!user) {
      return null;
    }
    return (
      <div>
        <Header as="h1">Login Success</Header>
        <div>
          <p>
            Hi, {user.username}. You have just successfully logged in,
            and were forwarded here
            by <code>componentWillReceiveProps()</code> in <code>App.js</code>,
            which is listening to
            the auth reducer via redux <code>@connect</code>. How exciting!
          </p>
          <p>
            The same function will forward you to <code>/</code> should
            you chose to log out. The choice is yours...
          </p>
          <div>
            <Button secondary size="mini" onClick={logout}><Icon name="sign out" />{' '}Log Out</Button>
          </div>
        </div>
      </div>
    );
  }
}
