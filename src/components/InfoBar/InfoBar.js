import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { load } from '../../redux/modules/info'

const styles = require('./InfoBar.scss')

const InfoBar = (props) => {
  const { info, load } = props // eslint-disable-line no-shadow
  return (
    <div className={styles.infoBar}>
      <hr />
      This is an info bar
      {' '}
      <strong>{info ? info.message : 'no info!'}</strong>
      {' '}
      <span className={styles.time}>{info && `at ${new Date(info.time)}`}</span>
      <br />
      <button
        className="btn btn-sm btn-info" onClick={load}
      >
        <i className="fa fa-refresh" />
        Reload from server
      </button>
    </div>
  )
}

InfoBar.propTypes = {
  info: PropTypes.object,
  load: PropTypes.func.isRequired,
}

export default connect(
  store => ({ info: store.info.data }),
  dispatch => bindActionCreators({ load }, dispatch))(InfoBar)
