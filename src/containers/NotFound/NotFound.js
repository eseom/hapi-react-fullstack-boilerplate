// @flow

import React, { Component, PropTypes } from 'react';
import { Message } from 'semantic-ui-react';

export default class NotFound extends Component {
  static propTypes = {
    location: PropTypes.object,
  }

  render() {
    return (
      <div className="container">
        <h1>404 not found!</h1>
        <Message
          error
          header="There is no such path."
          content={this.props.location.pathname}
        />
      </div>
    );
  }
}
