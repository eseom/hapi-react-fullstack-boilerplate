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

import styles from './App.scss'

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
  state => ({
    user: state.auth.user && state.auth.user.username ? state.auth.user : null,
  }),
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

  renderHeader() {
    const { user } = this.props
    const { activeItem } = this.state
    return (
      <nav className="navbar navbar navbar-light navbar-toggleable-md bg-faded" style={{ backgroundColor: '#fff' }}>
        <button className="navbar-toggler navbar-toggler-right" type="button" onClick={this.toggleMenu}>
          <span className="navbar-toggler-icon" />
        </button>
        <Link className="navbar-brand headline" to="/">hapi react fullstack boilerplate</Link>
        <div className={!this.state.menuVisible && 'collapse navbar-collapse'}>
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0" />
          <ul className="navbar-nav my-2 my-lg-0">
            <li className={`nav-item ${activeItem === 'home' && 'active'}`} key="home">
              <Link className="nav-link" to="/"> Home </Link>
            </li>
            <li className={`nav-item ${activeItem === 'about' && 'active'}`} key="about">
              <Link className="nav-link" to="/about"> About </Link>
            </li>
            <li className={`nav-item ${activeItem === 'items' && 'active'}`} key="items">
              <Link className="nav-link" to="/items"> Items </Link>
            </li>
            <li className={`nav-item ${activeItem === 'todo' && 'active'}`} key="todo">
              <Link className="nav-link" to="/todo"> Todo </Link>
            </li>
            {user ?
              <li className={`nav-item ${activeItem === 'chat' && 'active'}`} key="chat">
                <Link className="nav-link" to="/chat"> Chat </Link>
              </li>
              :
              null
            }
            <li className={`nav-item ${activeItem === 'no_route_page' && 'active'}`} key="notfound">
              <Link className="nav-link" to="/no_route_page"> NotFound </Link>
            </li>
            {user ?
              <li className={`${styles.headerLink} nav-item`} key="logout">
                {/* <span className="nav-link">Logged as {user.username}</span>{' '} */}
                <Link className="nav-link" to="/logout" onClick={this.handleLogout}> Logout </Link>
              </li>
              :
              (() => ([
                <li className={`${styles.headerLink} nav-item ${activeItem === 'login' && 'active'}`} key="login">
                  <Link className="nav-link" to="/login"> Login </Link>{' '}
                </li>,
                <li className={`${styles.headerLink} nav-item ${activeItem === 'join' && 'active'}`} key="join">
                  <Link className="nav-link" to="/Join"> Join </Link>
                </li>,
              ]))()
            }
          </ul>
        </div>
      </nav>
    )
  }

  render() {
    return (
      <div>
        <Helmet {...config.app.head} />

        {this.renderHeader()}
        <div className="container" style={{ maxWidth: 1010 }}>
          <p />
          <div>
            {this.props.children}
          </div>
        </div>

        <div className="container-fluid">
          <InfoBar />
        </div>
      </div>
    )
  }
}
