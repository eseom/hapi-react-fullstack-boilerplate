import * as React from 'react'
import { connect } from 'react-redux'
import { asyncConnect } from 'redux-connect'
import { Link } from 'react-router'
import * as Helmet from 'react-helmet'

import { Header, Jumbotron, Button, Container } from 'reactstrap'

import { isLoaded as isInfoLoaded, load as loadInfo } from '../../redux/modules/info'

interface IProps {
  dispatch?: Function,
  info: {
    loaded: Boolean,
    stuff: String,
  },
}

// interface IState { }

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = []
    if (!isInfoLoaded(getState())) {
      promises.push(dispatch(loadInfo()))
    }
    return Promise.all(promises)
  },
}])
@connect(
  (store) => ({ info: store.info }),
  (dispatch) => ({ dispatch }),
)
export class Home extends React.Component<IProps, {}> {
  render() {
    const style = require('./Home.scss')
    return (
      <Container className={style.mainContainer}>
        <header>
          <h2>Home {this.props.info.loaded}</h2>
        </header>

        <Jumbotron>
          <h1 className="display-3">typescript react starter kit</h1>
          <p className="lead">This is a boilerplate for react based fullstack web stack.</p>
          <hr className="my-2" />
          <p>integration of both client and server makes easier development.</p>
          <p className="lead">
            <Button color="primary">Learn More</Button>
          </p>
        </Jumbotron>

        <nav>
          <h4>Router Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>

          <h4>Components</h4>
          <ul>
            <li><Link href="https://hapijs.com/">Hapi</Link></li>
            <li><Link href="https://facebook.github.io/react/">React</Link></li>
            <li><Link href="https://reactstrap.github.io">Reactstrap</Link></li>
          </ul>
        </nav>
        <span>simple component. fetched data from store: {this.props.info.stuff}</span>
        <hr />
        <Button onClick={this.getInfo}>fetch data</Button>
      </Container>
    )
  }

  getInfo = () => {
    this.props.dispatch(loadInfo())
  }
}
