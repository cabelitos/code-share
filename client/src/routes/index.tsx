import type { RouteProps } from 'react-router-dom';
import { Route } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';
import Login from './Login';
import Home from './Home';
import Notepad from './Notepad';
import routeNames from './routeNames';

const routes: (RouteProps & {
  key: string;
  routeComponent: React.ComponentClass | React.FunctionComponent;
})[] = [
  {
    component: Login,
    key: routeNames.login,
    path: routeNames.login,
    routeComponent: Route,
  },
  {
    component: Notepad,
    key: routeNames.notepad,
    path: routeNames.notepad,
    routeComponent: ProtectedRoute,
  },
  {
    component: Home,
    key: routeNames.home,
    path: routeNames.home,
    routeComponent: ProtectedRoute,
  },
];

export default routes;
