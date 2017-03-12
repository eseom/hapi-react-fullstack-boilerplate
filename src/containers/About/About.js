/* eslint global-require: "off" */

import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { Header, Message, Button } from 'semantic-ui-react'
import { MiniInfoBar } from '../../components'

export default class About extends Component {

  state = {
    showKitten: false,
  }

  handleToggleKitten = () => this.setState({ showKitten: !this.state.showKitten })

  render() {
    const { showKitten } = this.state
    const kitten = require('./kitten.jpg')
    return (
      <div className="container-fluid">
        <Helmet title="About Us" />

        <h3>About us</h3>

        <p>
          This project was created by Eunseok Eom
          (<a href="https://github.com/eseom" rel="noopener noreferrer" target="_blank">@eseom</a>),
          based on
          (<a href="https://twitter.com/erikras" rel="noopener noreferrer" target="_blank">@erikras</a>)&apos;s project,
          react-redux-universal-hot-example.
        </p>

        <h4>
          Mini Bar <span style={{ color: '#aaa' }}>(not that kind)</span>
        </h4>

        <p>
          Hey! You found the mini info bar! The following component is
          display-only. Note that it shows the same
          time as the info bar.
        </p>

        <p>
          {/* <MiniInfoBar /> */}
        </p>

        <h4>Images</h4>

        <p>
          Psst! Would you like to see a kitten?
          <button
            style={{ marginLeft: 10 }}
            className={`btn btn-sm btn-${(showKitten ? 'danger' : 'success')}`}
            onClick={this.handleToggleKitten}
          >
            {showKitten ? 'No! Take it away!' : 'Yes! Please!'}
          </button>
        </p>

        {showKitten && <div><img src={kitten} alt="kitten" /></div>}
      </div>
    )
  }
}
