import React, { Component } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

@connect(() => ({}), {})
export default class Form extends Component {
  static propTypes = {
  }

  render() {
    return (
      <div className="container-fluid">
        <Helmet title="Todo" />

        <div className="row" style={{ marginBottom: 30 }}>
          <div className="col-lg-7 headline">
            <h2 style={{ lineHeight: '130%', marginTop: 30 }}>
              <strong>Todo</strong>
              <br />
              <small>(crud example)</small>
            </h2>
          </div>
        </div>

        <div className="alert alert-warning">
          TODO: todo list
        </div>
      </div>
    )
  }
}
