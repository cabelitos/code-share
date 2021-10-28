import React from 'react';
import {
  Auth0Error,
  Auth0ParseHashError,
  WebAuth,
  Auth0DecodedHash,
} from 'auth0-js';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useAlert, AlertType } from '../alert';
import routeNames from '../../routes/routeNames';
import usePrevious from '../../hooks/usePrevious';
import {
  saveTokensToStorage,
  loadTokensFromStorage,
  TokensData,
  clearStorage,
} from './storage';
import getPermissions, { Permissions } from './permissions';

type TokensDataWithPermissions = TokensData & { permissions: Set<string> };

interface AuthContextData {
  sendLoginEmail: (
    email: string,
    successTitle: string,
    successMessage: string,
    shouldTriggerLoading?: boolean,
  ) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permissions) => boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  authData: TokensDataWithPermissions | null;
}

interface AuthRefContext {
  useAlertCtx: ReturnType<typeof useAlert>;
  t: (val: string) => string;
  history: ReturnType<typeof useHistory>;
}

const AuthContext = React.createContext<AuthContextData>({
  sendLoginEmail: (_: string) => Promise.reject(new Error('Missing context')),
  logout: () => {
    throw new Error('Missing context');
  },
  hasPermission: () => false,
  isLoading: false,
  isAuthenticated: false,
  authData: null,
});

const webAuth = new WebAuth({
  clientID: process.env.REACT_APP_AUTH_CLIENT_ID ?? '',
  domain: process.env.REACT_APP_AUTH_DOMAIN ?? '',
  responseType: 'token id_token',
  scope: 'openid profile email',
  audience: process.env.REACT_APP_AUTH_AUDIANCE ?? '',
  redirectUri: `${window.location.origin}${process.env.PUBLIC_URL}`,
});

const removeStateFromHash = (hash: string): string =>
  hash.replace(/&state=.+&/, '&');

const parseHash = () =>
  new Promise<Auth0DecodedHash | null>((resolve, reject) => {
    try {
      webAuth.parseHash(
        {
          hash: removeStateFromHash(window.location.hash),
          __enableIdPInitiatedLogin: true,
        },
        (
          err: Auth0ParseHashError | null,
          authData: Auth0DecodedHash | null,
        ) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(authData);
        },
      );
    } catch (err) {
      reject(err);
    }
  });

export const useAuth = (): AuthContextData => React.useContext(AuthContext);

const wrapAuth0Promise = <T,>(
  p: Promise<T>,
  setIsLoading: (value: boolean) => void,
  { t, useAlertCtx }: AuthRefContext,
): Promise<T> =>
  p
    .catch((err: Error | Auth0Error | Auth0ParseHashError) => {
      let message = t('unknownError');
      if ('description' in err && err.description) {
        message = err.description;
      } else if ('message' in err && err.message) {
        message = err.message;
      } else if ('errorDescription' in err && err.errorDescription) {
        message = err.errorDescription;
      }
      useAlertCtx.addAlert({
        message,
        title: t('loginFailedTitle'),
        type: AlertType.ERROR,
      });
      throw err;
    })
    .finally(() => setIsLoading(false));

const AuthProvider: React.FC<{}> = ({ children }) => {
  const useAlertCtx = useAlert();
  const { t } = useTranslation('login');
  const history = useHistory();
  const authRefContext = React.useRef<AuthRefContext>({
    useAlertCtx,
    t,
    history,
  });
  authRefContext.current = { useAlertCtx, t, history };

  const [authData, setAuthData] =
    React.useState<TokensDataWithPermissions | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const previousAuthData = usePrevious(authData);
  const [isLoadingToken, setIsLoadingToken] = React.useState(false);
  const sendLoginEmail = React.useCallback(
    (
      email: string,
      successTitle: string,
      successMessage: string,
      shouldTriggerLoading = true,
    ) =>
      wrapAuth0Promise(
        new Promise<void>((resolve, reject) => {
          try {
            if (shouldTriggerLoading) setIsLoading(true);
            webAuth.passwordlessStart(
              {
                connection: 'email',
                email,
                send: 'link',
              },
              (err: Auth0Error | null): void => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve();
              },
            );
            authRefContext.current.useAlertCtx.addAlert({
              message: successMessage,
              title: successTitle,
              type: AlertType.INFO,
            });
          } catch (err) {
            reject(err);
          }
        }),
        setIsLoading,
        authRefContext.current,
        // eslint-disable-next-line no-console
      ).catch(console.error),
    [],
  );

  const contextValue = React.useMemo<AuthContextData>(
    () => ({
      sendLoginEmail,
      isLoading,
      isAuthenticated: !!authData,
      authData,
      hasPermission: (perm: Permissions) =>
        authData?.permissions.has(perm) ?? false,
      logout: () => {
        clearStorage();
        setAuthData(null);
      },
    }),
    [sendLoginEmail, isLoading, authData],
  );

  React.useEffect(() => {
    setIsLoading(true);
    wrapAuth0Promise(
      parseHash().then((data: Auth0DecodedHash | null) => {
        if (data) {
          saveTokensToStorage(data.accessToken, data.idToken);
          setAuthData({
            accessToken: data.accessToken ?? null,
            idToken: data.idToken ?? null,
            permissions: getPermissions(data.accessToken),
          });
          return;
        }
        const loadedData = loadTokensFromStorage();
        if (!loadedData.accessToken || !loadedData.idToken) {
          setAuthData(null);
        } else {
          setAuthData({
            ...loadedData,
            permissions: getPermissions(loadedData.accessToken),
          });
        }
      }),
      setIsLoading,
      authRefContext.current,
    )
      .catch(() => setAuthData(null))
      .finally(() => setIsLoadingToken(true));
  }, []);

  React.useEffect(() => {
    if (!authData && previousAuthData) {
      authRefContext.current.history.replace(routeNames.login);
    } else if (!previousAuthData && authData) {
      if (!authData.permissions.size) {
        authRefContext.current.history.replace(routeNames.notepad);
      } else {
        authRefContext.current.history.replace(routeNames.home);
      }
    }
  }, [authData, previousAuthData]);

  return (
    <AuthContext.Provider value={contextValue}>
      {isLoadingToken ? children : null}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
