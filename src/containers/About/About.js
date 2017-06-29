/* eslint global-require: "off" */

import React, { Component } from 'react'
import Helmet from 'react-helmet'
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
        <Helmet title="About us" />

        <div className="row" style={{ marginBottom: 30 }}>
          <div className="col-lg-7 headline">
            <h2 style={{ lineHeight: '130%', marginTop: 30 }}>
              <strong>About us</strong>
              <br />
              <small>(widgets)</small>
            </h2>
          </div>
        </div>

        <div className="alert alert-info">
          This project was created by Eunseok Eom
          (<a href="https://github.com/eseom" rel="noopener noreferrer" target="_blank">@eseom</a>),
          based on
          (<a href="https://twitter.com/erikras" rel="noopener noreferrer" target="_blank">@erikras</a>)&apos;s project,
          react-redux-universal-hot-example.
        </div>

        <h4>
          Mini Bar <span style={{ color: '#aaa' }}>(not that kind)</span>
        </h4>

        <p>
          Hey! You found the mini info bar! The following component is
          display-only. Note that it shows the same
          time as the info bar.
        </p>

        <div>
          <MiniInfoBar />
        </div>

        <h4>Images</h4>

        <p>
          Psst! Would you like to see a kitten?
          <button
            style={{ marginLeft: 10 }}
            className={`btn btn-sm btn-outline-${(showKitten ? 'danger' : 'success')}`}
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
