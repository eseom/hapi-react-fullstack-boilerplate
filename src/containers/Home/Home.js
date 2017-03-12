/* eslint global-require: "off" */

import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { CounterButton } from '../../components'
import config from '../../config'

export default class Home extends Component {
  render() {
    const styles = require('./Home.scss')
    const items = [
      'HapiJS',
      'ReactJS 15',
      'SSR (server side rendering)',
      'Webpack2 + React-transform and react-transform-hmr',
      'React-Router 3',
      'Redux',
      'Document Head React-Helmet',
      'BabelJs',
      'Linting with eslint with airbnb javascript',
      'Testing with karma, mocha',
      'API Documentation Swagger',
      'Sequelize - covers traditional web apps.',
      'session based authentication',
      'Socket.io',
      'sass loader, node sass',
    ]
    return (
      <div className={`${styles.home} container-fluid`}>
        <Helmet title="Home" />

        <h3>{config.app.title}</h3>
        <p />

        <div className="alert alert-info">
          <h5 className="alert-heading">{config.app.subtitle}</h5>
          <p className="mb-0">
            {config.app.description}
          </p>
          <p className="mb-0">
            <a
              className={styles.github} href="https://github.com/eseom/hapi-react-fullstack-boilerplate.git"
              rel="noopener noreferrer"
              target="_blank"
            >
              <icon className="fa fa-github" />{' '}
              View on github
            </a>
          </p>
        </div>

        <h3>Features</h3>
        <ul>
          {items.map((it, index) => (
            <li key={index}>{it}</li>
          ))}
        </ul>

        <h3>simple redux example</h3>
        <p>
          <CounterButton color="red" basic />
        </p>
      </div>
    )
  }
}
