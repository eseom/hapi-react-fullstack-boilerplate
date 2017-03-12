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
    sidebarVisible: false,
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
  }

  handleItemClick = (event, { name }) => this.setState({
    activeItem: name,
    sidebarVisible: false,
  })

  handleLogout = (event) => {
    event.preventDefault()
    this.props.logout()
  }

  toggleVisibility = () => {
    this.setState({ sidebarVisible: !this.state.sidebarVisible })
  }

  render() {
    const { user } = this.props
    const { activeItem } = this.state

    return (
      <div>
        <Helmet {...config.app.head} />

        <div className="container-fluid">
          <h2><Link to="/"><strong>HRFB &nbsp;<small><em>0.1.0</em></small></strong></Link></h2>
          <ul>
            <li>
              <Link to="/" name="home" className={activeItem === 'home' && 'active'}>
                Home (list, link, message, redux)
              </Link>
            </li>
            <li>
              <Link to="/about" name="about" className={activeItem === 'about' && 'active'}>
                About (widgets)
              </Link>
            </li>
            <li>
              <Link to="/items" name="items" className={activeItem === 'items' && 'active'}>
                Items (fetching data asynchronously)
              </Link>
            </li>
            <li>
              <Link to="/todo" name="todo" className={activeItem === 'todo' && 'active'}>
                Todo
              </Link>
            </li>
            {user ?
              <li>
                <Link to="/chat" name="chat" className={activeItem === 'chat' && 'active'}>
                  Chat
                </Link>
              </li>
              :
              null
            }
            <li>
              <Link to="/no_route_page" name="no_route_page" className={activeItem === 'no_route_page' && 'active'}>
                Not found (404 page)
              </Link>
            </li>

            {user ?
              <li>
                <span>Logged as {user.username}</span>{' '}
                <Link to="/logout" name="logout" onClick={this.handleLogout}>
                  Logout
                </Link>
              </li>
              :
              <li>
                <Link to="/login" name="login" className={activeItem === 'login' && 'active'}>
                  Login
                </Link>{' '}
                <Link to="/join" name="join" className={activeItem === 'join' && 'active'}>
                  Join
                </Link>
              </li>
            }

          </ul>
        </div>

        <div className="container-fluid">
          <hr />
        </div>

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
