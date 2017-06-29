/* eslint global-require: "off" */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import { reduxForm, SubmissionError } from 'redux-form'
import * as authActions from '../../redux/modules/auth'
import ForgotPasswordForm from './ForgotPasswordForm'

@connect(
  store => ({
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
    logout: PropTypes.func,
  }

  state = {
    requested: false,
  }

  onSubmit = (orig) => {
    const values = Object.assign({
      email: '',
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
    if (errorFound) {
      throw new SubmissionError({
        ...seo,
        _error: 'Login failed!',
      })
    }

    // 비밀번호 찾기 요청
    // this.props.findPassword(values.email)

    this.setState({
      requested: true,
    })
  }

  render() {
    const styles = require('./Login.scss')
    return (
      <div className={`${styles.loginPage} container-fluid`}>

        <Helmet title="Forgot password?" />

        {this.state.requested ?
          <div>
            <h2 className="title">Check your email <span /></h2>
            <div style={{ marginTop: 30, marginBottom: 30, textAlign: 'center' }}>
              <img src={require('../Join/letter.png')} alt="" style={{ width: 200 }} />
            </div>
            <div style={{ marginTop: 20 }}>
              Email sent that you could find your account by.
              You would receive an email containing instructions on how to create a new password.
            </div>
            <div style={{ marginTop: 20 }}>
              <small> Back to <Link to="/login">Login</Link></small>
            </div>
          </div>
          :
          <ForgotPasswordForm
            submitValidate={this.onSubmit}
          />
        }
      </div>
    )
  }
}

