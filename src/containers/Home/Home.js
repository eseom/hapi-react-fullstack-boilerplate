/* eslint global-require: "off" */

import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { CounterButton } from '../../components'
import config from '../../config'

@connect(store => ({
  message: store.hapines.message,
}), {})
export default class Home extends Component {
  render() {
    const styles = {
      thumb1: {
        backgroundPosition: '50% 50% !important',
        backgroundSize: 'cover !important',
        width: '100%',
        height: 300,
      },
    }
    const items = [
      'HapiJS',
      'ReactJS 15',
      'SSR (server side rendering)',
      'no local proxy for development and production',
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
      'react-hapines',
      'sass loader, node sass',
    ]
    return (
      <div className={`${styles.home}`}>
        <Helmet title="Home" />

        <div className="row" style={{ marginBottom: 30 }}>
          <div className="col-lg-7 headline">
            <h3 style={{ lineHeight: '130%', marginTop: 70 }}>
              <strong style={{ fontSize: '2.0rem', color: '#8A629C' }}>{config.app.title}</strong>
              <br />
              (list, link, message, redux)
          </h3>
          </div>

          <div className="col-lg-12" style={{ textAlign: 'center', marginTop: 20 }}>
            <strong>last time from server through react-hapines</strong>
            {
              this.props.message.now ?
                <div>
                  <div>
                    {new Date(this.props.message.now).toLocaleString()}
                  </div>
                  <div>
                    <a
                      href="https://github.com/eseom/hapi-react-fullstack-boilerplate/blob/master/src/server/core/task.js"
                      target="_blank"
                      rel="noopener noreferrer"
                    >{this.props.message.description}</a>
                  </div>
                </div>
                :
                <div>
                  no message yet
                </div>
            }
          </div>

          <div className="col-lg-12" style={{ textAlign: 'center', marginTop: 20, marginBottom: 30 }}>
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
                VIEW ON GITHUB
            </a>
            </p>
          </div>

          <div className="col-lg-12">
            <img src={require('./jumbo1.jpg')} style={{ width: '100%' }} alt="" />
            <a href="http://www.lanlinglaurel.com/london-city-images/4934473.html"><i>image from http://www.lanlinglaurel.com/london-city-images/4934473.html</i></a>
          </div>
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

        <div className="row">
          <div className="headline offset-lg-5 col-lg-7" style={{ textAlign: 'right' }}>
            <h3 style={{ lineHeight: '130%', marginTop: 70, marginBottom: 80 }}>
              <i className="fa fa-quote-left" />&nbsp;&nbsp;
              Think like a man of action and<br />act like man of thought.
          </h3>
          </div>
        </div>

        <p />

        <ul style={{ display: 'none' }}>
          {items.map((it, index) => (
            <li key={index}>{it}</li>
          ))}
        </ul>
      </div>

    )
  }
}
