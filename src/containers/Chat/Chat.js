// @flow

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { List, Header, Button, Input } from 'semantic-ui-react';

@connect(
  state => ({ user: state.auth.user }),
)
export default class Chat extends Component {

  static propTypes = {
    user: PropTypes.object,
  };

  state = {
    message: '',
    messages: [],
  };

  componentDidMount() {
    if (socket) {
      socket.on('msg', this.onMessageReceived);
      setTimeout(() => {
        socket.emit('history', { offset: 0, length: 100 });
      }, 100);
    }
  }

  componentWillUnmount() {
    if (socket) {
      socket.removeListener('msg', this.onMessageReceived);
    }
  }

  onMessageReceived = (data) => {
    const messages = this.state.messages;
    messages.push(data);
    this.setState({ messages });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const msg = this.state.message;

    this.setState({ message: '' });

    socket.emit('msg', {
      from: this.props.user.name,
      text: msg,
    });
  }

  render() {
    const style = require('./Chat.scss');
    const { user } = this.props;

    return (
      <div className={`${style.chat} container`}>
        <Header as="h1">Chat</Header>

        {user &&
        <div>
          <List bulleted>
            {this.state.messages.map(msg => (
              <List.Item key={`chat.msg.${msg.id}`}>{msg.from}: {msg.text}</List.Item>
            ))}
          </List>
          <form className="login-form" onSubmit={this.handleSubmit}>
            <Input
              type="text"
              placeholder="Enter your message"
              value={this.state.message}
              onChange={(event) => {
                this.setState({ message: event.target.value });
              }}
            />
            <Button className="btn" primary onClick={this.handleSubmit}>Send</Button>
          </form>
        </div>
        }
      </div>
    );
  }
}
