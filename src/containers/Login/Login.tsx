import * as React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { Form, FormGroup, FormText, Label, Input, Container, Button } from 'reactstrap'

interface IProps {
  dispatch?: Function,
}

// interface IState { }

@connect(
  (store) => ({}),
  (dispatch) => ({ dispatch }),
)
export class Login extends React.Component<IProps, {}> {
  gotoHome() {
    this.props.dispatch(push('/'))
  }

  onSubmit = (e) => {
    e.preventDefault()
  }

  render() {
    const style = require('./Login.scss')
    return (
      <Container>

        <h3>Login</h3>

        <div className={style.loginForm}>
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Label for="inputEmail">Email</Label>
              <Input type="email" name="email" id="inputleEmail" placeholder="email" />
            </FormGroup>
            <FormGroup>
              <Label for="inputlePassword">Password</Label>
              <Input type="password" name="password" id="inputlePassword" placeholder="password" />
            </FormGroup>
            <Button type="submit">Login</Button>{' '}
            <Button onClick={this.gotoHome.bind(this)}>Home</Button>
          </Form>
        </div>
      </Container>
    )
  }
}
