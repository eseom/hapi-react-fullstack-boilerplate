// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Message } from 'semantic-ui-react';

@connect(() => ({}), {})
export default class Form extends Component {
  static propTypes = {
  }

  render() {
    return (
      <div>
        <h1>Form</h1>

        <Helmet title="Form" />

        <Message
          warning
          content="TODO: form"
        />
      </div>
    );
  }
}
