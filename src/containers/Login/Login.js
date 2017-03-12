/* eslint global-require: "off" */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
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
    <div>
      <label htmlFor={input.name}>{input.name}</label>
      <input
        // error={touched && !!error}
        className="form-control"
        label={
          <label htmlFor="">{label} {touched && ((error && <span>({error})</span>) || (warning && <span>({warning})</span>))}</label> // eslint-disable-line jsx-a11y/label-has-for
        }
        type={type}
        {...input}
      />
    </div>
  )

  render() {
    const styles = require('./Login.scss')
    const {
       user, logout, loggingIn,
       handleSubmit, pristine, reset, submitting,
    } = this.props
    const { loginError } = this.state
    return (
      <div className={`${styles.loginPage} container-fluid`}>
        <h2>Login</h2>

        <Helmet title="Login" />

        {!user &&
          <form
            // error={loginError && !!loginError.error}
            onSubmit={handleSubmit(this.handleSubmit)}
          >
            <div className="alert alert-success">
              <div>
                This will *log you in* as this user,
                storing the username in the session of the API server.
              </div>
              <div>
                username: <strong>tester</strong>, password: <strong>1234</strong>
              </div>
            </div>
            <div className="alert alert-info">
              The api respond delayed
              1 second on succeed,
              2 seconds on failure.
            </div>

            <div className="alert alert-danger" style={{ display: loginError.message ? 'block' : 'none' }}>
              {loginError.message}
            </div>

            <Field
              name="username" label="username" placeholder="Input your username"
              component={this.renderTextInput}
            />
            <Field
              name="password" type="password" label="password" placeholder="Input your password"
              component={this.renderTextInput}
            />

            <hr />

            <button type="submit" className="btn btn-sm btn-primary" disabled={submitting || loggingIn}><i className="fa fa-signin" />{' '}log In</button>{' '}
            <button type="button" className="btn btn-sm btn-default" disabled={pristine || submitting || loggingIn} onClick={reset}>reset</button>
          </form>
        }
        {user &&
          <div>
            <p>Hi, you are currently logged in as {user.username}.</p>
            <div>
              <button onClick={logout} className="btn btn-default"><i className="fa fa-signout" />{' '}Log Out</button>
            </div>
          </div>
        }
      </div>
    )
  }
}
