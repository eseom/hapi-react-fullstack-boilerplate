/* eslint no-throw-literal: "off" */

import React, { Component } from 'react'
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
  static displayName = 'JoinForm'

  render() {
    const { submitValidate, handleSubmit, submitting } = this.props
    return (
      <div>
        <h2 className="title">Forgot password? <span /></h2>

        <p style={{ marginTop: 40 }} />

        <form onSubmit={handleSubmit(submitValidate)}>

          <p style={{ marginBottom: 10 }}>Enter your email to help us identify you.</p>

          <Field
            name="email"
            type="text"
            component={renderField}
            label="Email"
          />
          {/*
          <Field
            name="password"
            type="password"
            component={renderField}
            label="Password"
          />
          */}
          <div style={{ marginTop: 20 }}>
            {/* {error && <strong>{error}</strong>} */}
            <button
              type="submit"
              className={`btn btn-primary ${styles.submitButton}`} disabled={submitting}
            >Next</button>
            {/*
            <button
              className="btn btn-default btn-sm" type="button"
              disabled={pristine || submitting} onClick={reset}
            > Clear Values </button>
            */}

            <div style={{ marginTop: 20 }}>
              <small> Already have an BeAmong ID? <Link to="/login">Login</Link></small>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

