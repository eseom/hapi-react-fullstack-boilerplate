// @flow
/* eslint global-require: "off" */

import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Header, Message, Button } from 'semantic-ui-react';
import { MiniInfoBar } from '../../components';

export default class About extends Component {

  state = {
    showKitten: false,
  }

  handleToggleKitten = () => this.setState({ showKitten: !this.state.showKitten });

  render() {
    const { showKitten } = this.state;
    const kitten = require('./kitten.jpg');
    return (
      <div className="container">
        <h1>About Us</h1>
        <Helmet title="About Us" />

        <Message
          info
          icon
        >
          <span>
            This project was originally created by Erik Rasmussen
            (<a href="https://twitter.com/erikras" rel="noopener noreferrer" target="_blank">@erikras</a>),
            but has since seen many contributions
            from the open source community. And forked by @eseom.
          </span>
        </Message>

        <Header as="h3">
          Mini Bar <span style={{ color: '#aaa' }}>(not that kind)</span>
        </Header>

        <p>Hey! You found the mini info bar! The following component is
          display-only. Note that it shows the same
          time as the info bar.
        </p>

        <MiniInfoBar />

        <h3>Images</h3>

        <p>
          Psst! Would you like to see a kitten?
          <Button
            size="mini"
            basic
            compact
            color="pink"
            style={{ marginLeft: 10 }}
            className={`btn btn-${(showKitten ? 'danger' : 'success')}`}
            onClick={this.handleToggleKitten}
          >
            {showKitten ? 'No! Take it away!' : 'Yes! Please!'}
          </Button>
        </p>

        {showKitten && <div><img src={kitten} alt="kitten" /></div>}
      </div>
    );
  }
}
