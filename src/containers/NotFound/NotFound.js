import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'

export default class NotFound extends Component {
  static propTypes = {
    location: PropTypes.object,
  }

  render() {
    return (
      <div className="container-fluid">
        <Helmet title="404 not found" />
        <h3>404 not found!</h3>

        <div className="alert alert-warning">
          <h5 className="alert-heading">There is no such path.</h5>
          <p className="mb-0">
            {this.props.location.pathname}
          </p>
        </div>
        <Link to="/">back to the main</Link>
      </div>
    )
  }
}
