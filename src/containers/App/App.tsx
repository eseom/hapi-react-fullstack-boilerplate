import * as React from 'react'
import { connect } from 'react-redux'
import { asyncConnect } from 'redux-connect'
import { Link } from 'react-router'

import { Container, Navbar, NavbarToggler, NavbarBrand, Collapse, Nav, NavItem, NavLink } from 'reactstrap'

interface IProps {
  dispatch: Function,
  info: {
    loaded: Boolean,
  },
}

// interface IState { }

@connect(
  (store) => ({ info: store.info }),
  (dispatch) => ({ dispatch }),
)
export class App extends React.Component<IProps, {}> {

  state = {
    isOpen: false,
  }

  constructor(props: IProps) {
    super(props)
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  render() {
    const style = require('./App.scss')
    return (
      <div>
        <Navbar color="faded" light toggleable>
          <NavbarToggler right onClick={this.toggle.bind(this)} />
          <NavbarBrand href="/">typescript react starter kit</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav>
              <NavItem>
                <NavLink tag={Link} to="/">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/login">Login</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Container fluid>
          <div id="asdf">
            <div className={style.mainContainer}>
              {this.props.children}
            </div>
          </div>
        </Container>
      </div>
    )
  }
}

