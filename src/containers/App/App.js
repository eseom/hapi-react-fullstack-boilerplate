import React, { PropTypes, Component } from 'react'
// import { connect } from 'react-redux'
import style from './App.css'

// @connect(store => ({ store }))
export class App extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  static defaultProps = {
    children: null,
  }
  render() {
    return (
      <div>
        <header className={style.klass}>
          header34
        </header>
        {this.props.children}
      </div>
    )
  }
}
