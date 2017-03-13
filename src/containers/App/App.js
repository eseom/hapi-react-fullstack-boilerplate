import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { push } from 'react-router-redux'
import { asyncConnect } from 'redux-connect'
import { Link } from 'react-router'

import { isLoaded as isInfoLoaded, load as loadInfo } from '../../redux/modules/info'
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from '../../redux/modules/auth'
import { InfoBar } from '../../components'
import config from '../../config'
import '../../helpers/Html.scss'
// import styles from './App.scss'

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = []

    if (!isInfoLoaded(getState())) {
      promises.push(dispatch(loadInfo()))
    }
    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()))
    }

    return Promise.all(promises)
  },
}])
@connect(
  state => ({ user: state.auth.user && state.auth.user.username ? state.auth.user : null }),
  { logout, pushState: push })
export default class App extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    routes: PropTypes.array,
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
  }

  static state = {
    menuVisible: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      activeItem: props.routes[1].path || 'home',
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState('/loginSuccess')
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/')
    }
    this.setState({
      menuVisible: false,
    })
  }

  handleLogout = (event) => {
    event.preventDefault()
    this.props.logout()
  }

  toggleMenu = () => {
    this.setState({ menuVisible: !this.state.menuVisible })
  }

  render() {
    const { user } = this.props
    const { activeItem } = this.state

    return (
      <div>
        <Helmet {...config.app.head} />

        <nav className="navbar navbar-inverse navbar-toggleable-md bg-inverse bg-faded">
          <button className="navbar-toggler navbar-toggler-right" type="button" onClick={this.toggleMenu}>
            <span className="navbar-toggler-icon" />
          </button>
          <a className="navbar-brand" href="/">HRFB 0.1</a>
          <div className={!this.state.menuVisible && 'collapse navbar-collapse'}>
            <ul className="navbar-nav">
              <li className={`nav-item ${activeItem === 'home' && 'active'}`}>
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className={`nav-item ${activeItem === 'about' && 'active'}`}>
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              <li className={`nav-item ${activeItem === 'items' && 'active'}`}>
                <Link className="nav-link" to="/items">
                  Items
                </Link>
              </li>
              <li className={`nav-item ${activeItem === 'todo' && 'active'}`}>
                <Link className="nav-link" to="/todo">
                  Todo
                </Link>
              </li>
              {user ?
                <li className={`nav-item ${activeItem === 'chat' && 'active'}`}>
                  <Link className="nav-link" to="/chat">
                    Chat
                  </Link>
                </li>
                :
                null
              }
              <li className={`nav-item ${activeItem === 'no_route_page' && 'active'}`}>
                <Link className="nav-link" to="/no_route_page">
                  NotFound
                </Link>
              </li>
              {user ?
                <li className="nav-item">
                  {/* <span className="nav-link">Logged as {user.username}</span>{' '} */}
                  <Link className="nav-link" to="/logout" onClick={this.handleLogout}>
                    Logout
                  </Link>
                </li>
                :
                (() => ([
                  <li className={`nav-item ${activeItem === 'login' && 'active'}`}>
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>{' '}
                  </li>,
                  <li className={`nav-item ${activeItem === 'join' && 'active'}`}>
                    <Link className="nav-link" to="/join">
                      Join
                    </Link>
                  </li>,
                ]))()
              }
            </ul>
          </div>
        </nav>

        <p />

        <div>
          {this.props.children}
        </div>

        <div className="container-fluid">
          <InfoBar />
        </div>
      </div>
    )
  }
}
