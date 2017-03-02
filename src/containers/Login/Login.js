/* eslint global-require: "off" */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { Icon, Message, Header, Button, Form } from 'semantic-ui-react'
import { reduxForm, Field } from 'redux-form'
import * as authActions from '../../redux/modules/auth'

const defaultLoginError = { error: false, message: '' }

const validate = (values) => {
  const errors = {}
  if (!values.username) {
    errors.username = 'required'
  }
  if (!values.password) {
    errors.password = 'required'
  }
  return errors
}

@connect(
  store => ({
    user: store.auth.user && store.auth.user.username ? store.auth.user : null,
    loginError: store.auth.loginError,
    loggingIn: store.auth.loggingIn,
  }),
  authActions,
)
@reduxForm({
  form: 'loginForm',
  validate,
})
export default class extends Component {
  static displayName = 'Login'
  static propTypes = {
    user: PropTypes.object,
    loginError: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
    loggingIn: PropTypes.bool,

    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    reset: PropTypes.func,
    submitting: PropTypes.bool,
  }

  state = {
    loginError: defaultLoginError,
  }

  componentWillReceiveProps(props) {
    this.setState({
      loginError: (!this.props.loginError && props.loginError ?
        props.loginError : defaultLoginError),
    })
  }

  handleSubmit = (formData) => {
    this.props.login(formData.username, formData.password)
  }

  renderTextInput = ({ input, label, type, meta: { touched, error, warning } }) => (
    <Form.Field>
      <Form.Input
        error={touched && !!error}
        label={
          <label htmlFor="">{label} {touched && ((error && <span>({error})</span>) || (warning && <span>({warning})</span>))}</label> // eslint-disable-line jsx-a11y/label-has-for
        }
        type={type}
        {...input}
      />
    </Form.Field>
  )

  render() {
    const styles = require('./Login.scss')
    const {
       user, logout, loggingIn,
       handleSubmit, pristine, reset, submitting,
    } = this.props
    const { loginError } = this.state
    return (
      <div className={`${styles.loginPage} container`}>
        <Header as="h1">Login</Header>
        <Helmet title="Login" />
        {!user &&
          <Form
            error={loginError && !!loginError.error}
            onSubmit={handleSubmit(this.handleSubmit)}
          >
            <Message
              info
              content={
                <div>
                  <div>
                    This will *log you in* as this user,
                    storing the username in the session of the API server.
                  </div>
                  <div>
                    username: <strong>tester</strong>, password: <strong>1234</strong>
                  </div>
                </div>
              }
            />
            <Message
              content={
                <div>
                  The api respond delayed
                  1 second on succeed,
                  2 seconds on failure.
                </div>
              }
            />
            <Field
              name="username" label="username" placeholder="Input your username"
              component={this.renderTextInput}
            />
            <Field
              name="password" type="password" label="password" placeholder="Input your password"
              component={this.renderTextInput}
            />
            <Message
              error
              content={loginError.message}
            />
            <Form.Field>
              <Button basic size="small" primary type="submit" disabled={submitting || loggingIn}><Icon name="sign in" />{' '}log In</Button>
              <Button basic size="small" type="button" disabled={pristine || submitting || loggingIn} onClick={reset}>reset</Button>
            </Form.Field>
          </Form>
        }
        {user &&
          <div>
            <p>Hi, you are currently logged in as {user.username}.</p>
            <div>
              <Button secondary size="mini" onClick={logout}><Icon name="sign out" />{' '}Log Out</Button>
            </div>
          </div>
        }
      </div>
    )
  }
}
