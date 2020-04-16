import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../../containers/Users/SignUp';
import SignInPage from '../../containers/Users/SignIn';
import Dashboard from '../../containers/Dashboard';
import ProjectList from '../../containers/ProjectList';
import NewProject from '../../containers/Projects/NewProject';
import PasswordForgetPage from '../../containers/Users/PasswordForget';
import HomePage from '../../containers/Dashboard/Home';
import AccountPage from '../../containers/Dashboard/Account';
import AdminPage from '../../containers/Dashboard/Admin';
import * as ROUTES from '../../utilities/constants/routes';
import { withAuthentication } from '../../utilities/Session';

const App = () => (
  <Router>
    <div>
      <Navigation />
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route
        path={ROUTES.PASSWORD_FORGET}
        component={PasswordForgetPage}
      />
      <Route path={ROUTES.HOME} component={HomePage} />
      <Route path={ROUTES.DASHBOARD} component={Dashboard} />
      <Route path={ROUTES.PROJECTS} component={ProjectList} />
      <Route path={ROUTES.NEW_PROJECT} component={NewProject} />
      <Route path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
    </div>
  </Router>
);

export default withAuthentication(App);