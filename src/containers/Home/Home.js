// @flow
/* eslint global-require: "off" */

import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { Icon, List, Message, Header } from 'semantic-ui-react';
import { CounterButton } from '../../components';
import config from '../../config';

export default class Home extends Component {
  render() {
    const styles = require('./Home.scss');
    // require the logo image both from client and server
    const items = [
      'HapiJS',
      'ReactJS',
      'SSR',
      'Webpack2 + React-transform and react-transform-hmr',
      'React-Router',
      'Redux',
      'Document Head React-Helmet',
      'BabelJs',
      'Linting with eslint & jscs',
      'Testing with karma, mocha',
      'API Documentation Swagger',
      'Sequelize - cover traditional web apps.',
      'session based authentication',
      'Socket.io',
      'sass loader, node sass',
      'SemanticUI',
    ];
    return (
      <div className={styles.home}>
        <Header as="h1">{config.app.title}</Header>

        <Helmet title="Home" />

        <img src={require('../Home/flux-logo.png')} alt="" style={{ width: 120, height: 120 }} />

        <Message
          info
          header={config.app.subtitle}
          content={config.app.description}
        />

        <p>
          <a
            className={styles.github} href="https://github.com/eseom/hapi-react-fullstack-boilerplate.git"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon name="github" />
            View on github
          </a>
        </p>

        <h3>Features</h3>
        <List items={items} bulleted />

        <h3>simple redux example</h3>
        <p>
          <CounterButton multireducerKey="counter1" color="red" basic />
          <CounterButton multireducerKey="counter2" color="brown" basic />
          <CounterButton multireducerKey="counter3" color="violet" basic />
        </p>
      </div>
    );
  }
}
