/* eslint no-throw-literal: "off" */

import React, { Component } from 'react'
import FacebookLogin from 'react-facebook-login'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form'

const styles = require('./Login.scss')

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error },
}) =>
  <div className="form-group">
    <input {...input} type={type} autoComplete="off" placeholder={label} className={`${touched && error ? styles.error : ''} form-control`} />
    {touched && error && <div className={styles.description}>{error}</div>}
  </div>

@reduxForm({
  form: 'joinForm',
})
export default class extends Component {
  static displayName = 'LoginForm'

  state = {
    loginError: {},
  }

  componentWillReceiveProps(nextProps) {
    // 부모로부터 받은 loginError 가 새로 생성되었을 경우만 state 를 갱신함
    if (this.props.loginError.message !== '' && nextProps.loginError.message !== '') {
      this.setState({
        loginError: {},
      })
    } else if (this.props.loginError.message === '' && nextProps.loginError.message !== '') {
      this.setState({
        loginError: nextProps.loginError,
      })
    }
  }

  render() {
    const { submitValidate, handleSubmit, loggingIn } = this.props
    return (
      <div>
        <h2 className="title">Login <span>sign in with you ID</span></h2>

        <p style={{ marginTop: 40 }} />

        <div className="alert alert-success">
          <div>
            This will *log you in* as this user,
                storing the email in the session of the API server.
              </div>
          <div>
            email: <strong>tester@hrfb.com</strong>, password: <strong>1234</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit(submitValidate)}>

          <div className="form-group">
            <FacebookLogin
              appId="1727016080672135"
              fields="name,email,picture"
              cssClass={styles.facebookButton}
              callback={this.props.responseFacebook}
              textButton={'continue with Facebook'}
              icon={<i className="fa fa-facebook" style={{ marginRight: 20 }} />}
            />
          </div>

          <hr />

          <center style={{ marginBottom: 10 }}>or login with email</center>

          <Field
            name="email"
            type="text"
            component={renderField}
            label="Email"
          />
          <Field
            name="password"
            type="password"
            component={renderField}
            label="Password"
          />
          <div style={{ marginTop: 20 }}>
            {this.state.loginError.message && <div
              className={styles.description}
              style={{ textAlign: 'center', marginBottom: 10 }}
            >{this.state.loginError.message}</div>}

            <small className="pull-right">
              <Link to="/forgot-password">Forgot password?</Link>
            </small>
            <button
              type="submit"
              className={`btn btn-primary ${styles.submitButton}`}
              disabled={loggingIn}
            >{loggingIn ? 'Wait...' : 'Login'}</button>

            <div style={{ marginTop: 20 }}>
              <small> Not a member yet? <Link to="/join">Get an ID</Link></small>
            </div>
          </div>
        </form>
        <hr />
        <div className="alert alert-info">
          The api respond delayed
              1 second on succeed,
              2 seconds on failure.
            </div>
      </div>
    )
  }
}

