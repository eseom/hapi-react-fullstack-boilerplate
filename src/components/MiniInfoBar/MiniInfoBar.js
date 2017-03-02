import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

const MainInfoBar = (props) => {
  const { time } = props
  return (
    <div className="mini-info-bar">
      The info bar was last loaded at
      {' '}
      <span>{time && new Date(time).toString()}</span>
    </div>
  )
}

MainInfoBar.propTypes = {
  time: PropTypes.number,
}

export default connect(store => ({ time: store.info.data.time }))(MainInfoBar)
