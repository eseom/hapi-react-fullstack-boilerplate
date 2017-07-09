/* eslint global-require: "off" */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { reduxForm, SubmissionError } from 'redux-form'
import * as authActions from '../../redux/modules/auth'
import LoginForm from './LoginForm'

const defaultLoginError = { error: false, message: '' }

const responseFacebook = (response) => {
  authActions.loginFacebook(response)
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
})
export default class extends Component {
  static displayName = 'Login'

  static propTypes = {
    user: PropTypes.object,
    loginError: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
  }

  state = {
    loginError: defaultLoginError,
  }

  onSubmit = (orig) => {
    event.preventDefault()
    const values = Object.assign({
      email: '',
      password: '',
    }, orig)
    const seo = {} // submission error object
    let errorFound = false
    const reEmail = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!reEmail.test(values.email)) {
      seo.email = 'email is invalid'
      errorFound = true
    }
    if (values.email.trim() === '') {
      seo.email = 'email is required'
      errorFound = true
    }
    if (values.password === '') {
      seo.password = 'password is required'
      errorFound = true
    }
    if (errorFound) {
      throw new SubmissionError({
        ...seo,
        _error: 'Login failed!',
      })
    }

    // 로그인 요청
    this.props.login(values.email, values.password)
    return false
  }

  componentWillReceiveProps(props) {
    if (!this.props.user && props.user) { // logged in
      props.router.push('/')
      return
    }
    this.setState({
      loginError: (!this.props.loginError && props.loginError ?
        props.loginError : defaultLoginError),
    })
  }

  render() {
    const styles = require('./Login.scss')
    const {
      user, logout, loggingIn,
    } = this.props
    const { loginError } = this.state
    return (
      <div className={`${styles.loginPage} container-fluid`}>

        <Helmet title="Login" />

        {user ?
          <div>
            <p>Hi, you are currently logged in as {user.username}.</p>
            <div>
              <button onClick={logout} className="btn btn-default"><i className="fa fa-signout" />{' '}Log Out</button>
            </div>
          </div>
          :
          <LoginForm
            submitValidate={this.onSubmit}
            loginError={loginError}
            loggingIn={loggingIn}
            responseFacebook={responseFacebook}
          />
        }
      </div>
    )
  }
}
