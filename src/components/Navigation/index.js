import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <NavigationAuth authUser={authUser} />
      ) : (
        <NavigationNonAuth />
      )
    }
  </AuthUserContext.Consumer>
);
const NavigationAuth = ({ authUser }) => (
  <Navbar bg="light" expand="lg">
    <Navbar.Brand href="#home">Airia Helpboard</Navbar.Brand>
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link><Link to={ROUTES.LANDING}>Landing</Link></Nav.Link>
        <Nav.Link><Link to={ROUTES.HOME}>Home</Link></Nav.Link>
        <Nav.Link><Link to={ROUTES.ACCOUNT}>Account</Link></Nav.Link>
        {!!authUser.roles[ROLES.ADMIN] && (
        <li>
          <Nav.Link href="#link"><Link to={ROUTES.ADMIN}>Admin</Link></Nav.Link>
        </li>
        )}
        <Nav.Link href="#link"><SignOutButton /></Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);
const NavigationNonAuth = () => (
  <Navbar bg="light" expand="lg">
    <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href="#home"><Link to={ROUTES.LANDING}>Landing</Link></Nav.Link>
        <Nav.Link href="#link"><Link to={ROUTES.SIGN_IN}>Sign In</Link></Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);
export default Navigation;