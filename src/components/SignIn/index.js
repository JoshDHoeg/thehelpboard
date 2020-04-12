import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons'

import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
const SignInPage = () => (
  <Container>
    <Row>
      <Col md={{ span: 6, offset: 3 }}>

        <div className="login-register-page">
        
          <div className="welcome-text">
            <h3>We're glad to see you again!</h3>
            <SignUpLink />
          </div>
            
          <SignInForm />
            <hr data-content="OR" className="hr-text"></hr>
          </div>
      </Col>
    </Row>
    <Row>
      <Col md={{ span: 3, offset: 3 }}>
            <SignInGoogle />
      </Col>
      <Col md={{ span: 3 }}>
            <SignInFacebook />
      </Col>
    </Row>
  </Container>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';
    return (
      <form onSubmit={this.onSubmit}>
        <Form.Group controlId="signin.email">
          <Form.Label>Email address</Form.Label>
          <Form.Control 
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
            className="input-text with-border"
            required />
        </Form.Group>
        <Form.Group controlId="signin.password">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
            className="input-text with-border"
            required
          />
        </Form.Group>

        <PasswordForgetLink />

        <Button disabled={isInvalid} type="submit" className="button full-width button-sliding-icon ripple-effect margin-top-10" block>
          Sign In <i class="icon-material-outline-arrow-right-alt"></i>
        </Button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}
class SignInGoogleBase extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  onSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase
          .user(socialAuthUser.user.uid)
          .set({
            username: socialAuthUser.user.displayName,
            email: socialAuthUser.user.email,
            roles: {},
          });
      })
      .then(socialAuthUser => {
        this.setState({ error: null });
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
  render() {
    const { error } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <Button type="submit" className="google-login ripple-effect" block><FontAwesomeIcon icon={faGoogle} /> Sign In with Google</Button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

class SignInFacebookBase extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  onSubmit = event => {
    this.props.firebase
      .doSignInWithFacebook()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase
          .user(socialAuthUser.user.uid)
          .set({
            username: socialAuthUser.additionalUserInfo.profile.name,
            email: socialAuthUser.additionalUserInfo.profile.email,
            roles: {},
          });
      })
      .then(socialAuthUser => {
        this.setState({ error: null });
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
  render() {
    const { error } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <Button type="submit" className="facebook-login ripple-effect" block><FontAwesomeIcon icon={faFacebook} /> Sign In with Facebook</Button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}


const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

const SignInGoogle = compose(
  withRouter,
  withFirebase,
)(SignInGoogleBase);

const SignInFacebook = compose(
  withRouter,
  withFirebase,
)(SignInFacebookBase);

export default SignInPage;

export { SignInForm, SignInGoogle, SignInFacebook };