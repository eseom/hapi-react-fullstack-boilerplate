import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import { Header, Container, Message } from 'semantic-ui-react'

export default class NotFound extends Component {
  static propTypes = {
    location: PropTypes.object,
  }

  render() {
    return (
      <Container style={{ paddingTop: 40 }}>
        <Helmet title="404 not found" />
        <Header as="h1">404 not found!</Header>
        <Message
          error
          header="There is no such path."
          content={this.props.location.pathname}
        />
        <Link to="/">back to the main</Link>
      </Container>
    )
  }
}
