import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, Button } from 'semantic-ui-react';

import { load } from '../../redux/modules/info';

const styles = require('./InfoBar.scss');

const InfoBar = (props) => {
  const { info, load } = props; // eslint-disable-line no-shadow
  return (
    <div className={styles.infoBar}>
      <Button
        compact basic size="mini" color="violet"
        className={styles.button} onClick={load}
      >
        <Icon name="refresh" />
        Reload from server
      </Button>
      {' '}
      This is an info bar
      {' '}
      <strong>{info ? info.message : 'no info!'}</strong>
      {' '}
      <span className={styles.time}>{info && `at ${new Date(info.time).toLocaleString()}`}</span>
    </div>
  );
};

InfoBar.propTypes = {
  info: PropTypes.object,
  load: PropTypes.func.isRequired,
};

export default connect(
  store => ({ info: store.info.data }),
  dispatch => bindActionCreators({ load }, dispatch))(InfoBar);
