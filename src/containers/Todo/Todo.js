import React, { Component } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { Message } from 'semantic-ui-react'

@connect(() => ({}), {})
export default class Form extends Component {
  static propTypes = {
  }

  render() {
    return (
      <div>
        <h1>Todo</h1>

        <Helmet title="Todo" />

        <Message
          warning
          content="TODO: todo list"
        />
      </div>
    )
  }
}
