// @flow

import React, { Component, PropTypes } from 'react';
import { connectMultireducer } from 'multireducer';
import { Button } from 'semantic-ui-react';

import { increment } from '../../redux/modules/counter';

@connectMultireducer(
  (key, state) => ({ count: state.multireducer[key].count }),
  { increment },
)
export default class CounterButton extends Component {
  static propTypes = {
    count: PropTypes.number,
    increment: PropTypes.func.isRequired,
    color: PropTypes.string,
    basic: PropTypes.bool,
  }

  props = {
    className: '',
  }

  render() {
    const { count, increment, color, basic } = this.props; // eslint-disable-line no-shadow
    return (
      <Button onClick={increment} size="mini" color={color} basic={basic}>
        You have clicked me {count} time{count === 1 ? '' : 's'}.
      </Button>
    );
  }
}
