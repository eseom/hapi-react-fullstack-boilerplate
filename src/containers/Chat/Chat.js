import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { List, Header, Button, Input } from 'semantic-ui-react'

@connect(
  state => ({ user: state.auth.user }),
)
export default class Chat extends Component {

  static propTypes = {
    user: PropTypes.object,
  }

  state = {
    message: '',
    messages: [],
  }

  componentDidMount() {
    if (socket) {
      socket.on('msg', this.onMessageReceived)
      setTimeout(() => {
        socket.emit('history', { offset: 0, length: 100 })
      }, 100)
    }
  }

  componentWillUnmount() {
    if (socket) {
      socket.removeListener('msg', this.onMessageReceived)
    }
  }

  onMessageReceived = (data) => {
    const messages = this.state.messages
    messages.push(data)
    this.setState({ messages })
  }

  handleSubmit = (event) => {
    event.preventDefault()

    const msg = this.state.message

    this.setState({ message: '' })

    socket.emit('msg', {
      from: this.props.user.username,
      text: msg,
    })
  }

  render() {
    const style = require('./Chat.scss')
    const { user } = this.props

    return (
      <div className={`${style.chat} container-fluid`}>
        <h3>Chat</h3>

        {user &&
        <div>
          <ul>
            {this.state.messages.map(msg => (
              <li key={`chat.msg.${msg.id}`}>{msg.from}: {msg.text}</li>
            ))}
          </ul>
          <form className="login-form" onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="Enter your message"
              value={this.state.message}
              onChange={(event) => {
                this.setState({ message: event.target.value })
              }}
            />
            <button className="btn btn-sm btn-primary" onClick={this.handleSubmit}>Send</button>
          </form>
        </div>
        }
      </div>
    )
  }
}
