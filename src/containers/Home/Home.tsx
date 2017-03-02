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
    const pjson = require('../../../package.json')
    const dep = pjson.dependencies
    const devDep = pjson.devDependencies
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

          <h4>main components</h4>
          <ul>
            <li><Link href="https://hapijs.com/">Hapijs</Link> 16 for backend and packager server</li>
            <li><Link href="https://facebook.github.io/react/">React</Link> 15.4.2</li>
            <li><Link href="http://sequelizejs.com">Sequelize</Link> 3 for ORM</li>
            <li><Link href="https://github.com/ReactTraining/react-router">react-router</Link> 3.0.2</li>
            <li><Link href="http://visionmedia.github.io/superagent/">superagent</Link> for http communication</li>
            <li><Link href="https://reactstrap.github.io">Reactstrap</Link> 4</li>
            <li><Link href="https://webpack.js.org/">webpack</Link> 2</li>
            <li><Link href="https://github.com/halt-hammerzeit/webpack-isomorphic-tools/issues">webpack isomorphic tools</Link> for server side rendering</li>
          </ul>

          <h4>Dependencies</h4>
          <ul>
            {Object.keys(dep).map((k, key) => <li key={key}>{k} {dep[k]}</li>)}
          </ul>

          <h4>DevDependencies</h4>
          <ul>
            {Object.keys(devDep).map((k, key) => <li key={key}>{k} {devDep[k]}</li>)}
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
