import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NewProject from '../../containers/Projects/NewProject';
import HomePage from './Home';
import AccountPage from './Account';
import AdminPage from './Admin';
import Sidebar from '../../components/Sidebar'
import * as ROUTES from '../../utilities/constants/routes';
import { withAuthentication } from '../../utilities/Session';

const Dashboard = () => (
  <Router>
    <div>
      <Sidebar />
      <Route path={ROUTES.HOME} component={HomePage} />
      <Route path={ROUTES.NEW_PROJECT} component={NewProject} />
      <Route path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
    </div>
  </Router>
);

export default withAuthentication(Dashboard);