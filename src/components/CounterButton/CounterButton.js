import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { increment } from '../../redux/modules/counter'

@connect(
  store => ({ count: store.counter.count }),
  { increment },
)
export default class CounterButton extends Component {

  render() {
    const { count, increment, color, basic } = this.props // eslint-disable-line no-shadow
    let { className } = this.props
    className += ' btn btn-sm btn-default'
    return (
      <button className={className} onClick={increment}>
        You have clicked me {count} time{count === 1 ? '' : 's'}.
      </button>
    )
  }
}
