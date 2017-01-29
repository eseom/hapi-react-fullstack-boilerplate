// @flow

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import { Message, Button, Icon, Table } from 'semantic-ui-react';

import * as itemsActions from '../../redux/modules/items';

const { isLoaded, load: loadItems } = itemsActions;

@asyncConnect([{
  deferred: true,
  promise: ({ store: { dispatch, getState } }) => {
    if (!isLoaded(getState())) {
      return dispatch(loadItems());
    }
    return undefined;
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
  };

  renderTable = (error, items) => {
    if (!error && !items) {
      return (
        <Message
          info
          content="loading..."
        />
      );
    }
    if (error) {
      return (
        <Message
          error
          content="failed to load items."
        />
      );
    }
    return (
      <Table celled definition compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Package</Table.HeaderCell>
            <Table.HeaderCell>Version</Table.HeaderCell>
            <Table.HeaderCell>Note</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {items.map((it, key) => (
            <Table.Row key={key}>
              <Table.Cell>{it.id}</Table.Cell>
              <Table.Cell><a href={it.name.link}>{it.name.text}</a></Table.Cell>
              <Table.Cell><a href={it.version.link}>{it.version.text}</a></Table.Cell>
              <Table.Cell>{it.note}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="4">
              footer
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }

  render() {
    const { items, error, loading, load } = this.props;
    let refreshClassName = 'refresh';
    if (loading) {
      refreshClassName = 'asterisk';
    }
    return (
      <div>
        <h1>Items</h1>
        <Message
          info
          content="A table may be formatted to emphasize a first column that defines a row content."
        />
        {loading ?
          <Button size="mini" secondary basic loading>Loading</Button>
          :
          <Button size="mini" secondary basic onClick={load}>
            <Icon name={refreshClassName} />
            {' '}
            Reload
          </Button>
        }
        <h3>Packages Tracked by DistroWatch</h3>
        <p>https://distrowatch.com/packages.php</p>

        {this.renderTable(error, items)}
      </div>
    );
  }
}
