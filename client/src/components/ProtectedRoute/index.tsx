import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';

import { useAuth } from '../../services/auth';
import routeNames from '../../routes/routeNames';

const ProtectedRoute = ({
  component: Component,
  path,
  ...rest
}: RouteProps): JSX.Element => {
  const { isAuthenticated, isLoading } = useAuth();
  const onRender = React.useCallback(
    (props): JSX.Element | null => {
      if (isLoading) return null;
      if (isAuthenticated && Component) {
        return <Component {...props} />;
      }
      return <Redirect to={routeNames.login} />;
    },
    [isLoading, isAuthenticated, Component],
  );

  return <Route path={path} render={onRender} {...rest} />;
};

export default ProtectedRoute;
