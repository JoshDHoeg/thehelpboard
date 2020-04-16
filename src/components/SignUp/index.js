import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import { Container, Row, Col, Button, Form } from 'react-bootstrap';

const SignUpPage = () => (
<Container>
  <Row>
    <Col md={{ span: 6, offset: 3 }}>

      <div className="login-register-page">
      
        <div className="welcome-text">
          <h3>Welcome, we are excited to meet you!</h3>
        </div>
          
        <SignUpForm />
      </div>
    </Col>
  </Row>
</Container>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  isClient: false,
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign-in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne, isAdmin } = this.state;
    const roles = {};
    if (isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    }
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            username,
            email,
            roles,
          });
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });
    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      isAdmin,
      isClient,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <form onSubmit={this.onSubmit}>
      
        <Form.Group controlId="signin.password">
          <Form.Label>Username</Form.Label>
          <Form.Control 
            name="username"
            value={username}
            onChange={this.onChange}
            type="text"
            placeholder="Full Name"
            required
          />
        </Form.Group>

        <Form.Group controlId="signin.password">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
            required
          />
        </Form.Group>

        <Form.Group controlId="signin.password">
          <Form.Label>Repeat Your Password</Form.Label>
          <Form.Control 
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
            required
          />
        </Form.Group>

        <Form.Group controlId="signin.password">
          <Form.Label>Repeat Your Password</Form.Label>
          <Form.Control 
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm Password"
            required
          />
        </Form.Group>

        <label>
          Admin:
          <input
            name="isAdmin"
            type="checkbox"
            checked={isAdmin}
            onChange={this.onChangeCheckbox}
          />
        </label>

        <label>
          Client:
          <input
            name="isClient"
            type="checkbox"
            checked={isClient}
            onChange={this.onChangeCheckbox}
          />
        </label>

        <Button disabled={isInvalid} type="submit" className="button full-width button-sliding-icon ripple-effect margin-top-10" block>
          Sign Up <i class="icon-material-outline-arrow-right-alt"></i>
        </Button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}
const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };