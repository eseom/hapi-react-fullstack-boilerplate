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
        <h3>Todo</h3>

        <Helmet title="Todo" />

        <div className="alert alert-warning">
          TODO: todo list
        </div>
      </div>
    )
  }
}
