import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'

export default class NotFound extends Component {
  static propTypes = {
    location: PropTypes.object,
  }

  static state = {
    menuVisible: false,
  }

  toggleMenu = () => {
    this.setState({ menuVisible: !this.state.menuVisible })
  }

  renderHeader() {
    return (
      <nav className="navbar navbar navbar-light navbar-toggleable-md bg-faded" style={{ backgroundColor: '#fff' }}>
        <button className="navbar-toggler navbar-toggler-right" type="button" onClick={this.toggleMenu}>
          <span className="navbar-toggler-icon" />
        </button>
        <Link className="navbar-brand headline" to="/"> hapi react fullstack boilerplate </Link>
      </nav>
    )
  }

  render() {
    return (
      <div>
        <Helmet title="404 not found" />

        {this.renderHeader()}
        <div className="container" style={{ marginTop: 60, maxWidth: 1010 }}>
          <h2 className="header">404 not found!</h2>

          <div className="alert alert-danger" style={{ marginTop: 20 }}>
            <h5 className="alert-heading">There is no such path.</h5>
            <p className="mb-0">
              {this.props.location.pathname}
            </p>
          </div>

          <Link to="/">back to the main</Link>

          <hr />
          <div>
            * This page is not belongs to Container/App.js
          </div>
        </div>
      </div>
    )
  }
}
