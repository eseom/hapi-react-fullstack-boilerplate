/* eslint global-require: "off" */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Icon, Message, Header, Input, Button, Form } from 'semantic-ui-react';
import * as authActions from '../../redux/modules/auth';

@connect(
  state => ({ user: state.auth.user && state.auth.user.name ? state.auth.user : null }),
  authActions,
)
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
  }

  handleSubmit = (e, { formData }) => {
    e.preventDefault();
    this.props.login(formData.username);
  }

  render() {
    const { user, logout } = this.props;
    const styles = require('./Login.scss');
    return (
      <div className={`${styles.loginPage} container`}>
        <Header as="h1">Login</Header>
        <Helmet title="Login" />
        {!user &&
          <Form onSubmit={this.handleSubmit}>
            <Message
              info
              content="This will *log you in* as this user, storing the username in the session of the API server."
            />
            <Form.Field inline>
              <Input label="Your name" name="username" placeholder="Enter a username" />
              {' '}
              <Button primary type="submit"><Icon name="sign in" />{' '}log In</Button>
            </Form.Field>
          </Form>
        }
        {user &&
          <div>
            <p>Hi, you are currently logged in as {user.name}.</p>

            <div>
              <Button secondary size="mini" onClick={logout}><Icon name="sign out" />{' '}Log Out</Button>
            </div>
          </div>
        }
      </div>
    );
  }
}
