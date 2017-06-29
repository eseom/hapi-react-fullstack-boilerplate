import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { asyncConnect } from 'redux-connect'

import * as itemsActions from '../../redux/modules/items'

const { isLoaded, load: loadItems } = itemsActions

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    if (!isLoaded(getState())) {
      return dispatch(loadItems())
    }
    return undefined
  },
}])
@connect(store => ({
  items: store.items.data,
  error: store.items.error,
  loading: store.items.loading,
}),
  { ...itemsActions })
export default class extends Component {

  static propTypes = {
    items: PropTypes.array,
    error: PropTypes.object,
    loading: PropTypes.bool,
    load: PropTypes.func.isRequired,
    // editStart: PropTypes.func.isRequired,
  }

  renderTable = (error, items) => {
    if (!error && !items) {
      return (
        <div className="alert alert-info">
          loading...
        </div>
      )
    }
    if (error) {
      return (
        <div className="alert alert-danger">
          failed to load items.
        </div>
      )
    }
    return (
      <table className="table table-striped table-sm table-bordered">
        <thead>
          <tr>
            <th />
            <th>Package</th>
            <th>Version</th>
            <th>Note</th>
          </tr>
        </thead>

        <tbody>
          {items.map(it => (
            <tr key={it.id}>
              <td>{it.id}</td>
              <td><a href={it.name.link}>{it.name.text}</a></td>
              <td><a href={it.version.link}>{it.version.text}</a></td>
              <td>{it.note}</td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan="4">
              footer
            </td>
          </tr>
        </tfoot>
      </table>
    )
  }

  render() {
    const { items, error, loading, load } = this.props
    let refreshClassName = 'refresh'
    if (loading) {
      refreshClassName = 'asterisk'
    }
    return (
      <div className="container-fluid">
        <div className="row" style={{ marginBottom: 30 }}>
          <div className="col-lg-7 headline">
            <h2 style={{ lineHeight: '130%', marginTop: 30 }}>
              <strong>Items</strong>
              <br />
              <small>(fetching data asynchronously)</small>
            </h2>
          </div>
        </div>

        <div className="alert alert-info">
          A table may be formatted to emphasize a first column that defines a row content.
        </div>

        <p className="pull-right">
          {loading ?
            <button className="btn btn-sm btn-default">Loading</button>
            :
            <button className="btn btn-sm btn-outline-primary" onClick={load}>
              <i className={refreshClassName} />
              {' '}
              Reload
            </button>
          }
        </p>

        <h4>Packages Tracked by DistroWatch</h4>
        <p>https://distrowatch.com/packages.php</p>

        {this.renderTable(error, items)}
      </div>
    )
  }
}
