import React from 'react';
import { useTransition } from '@react-spring/web';

import Alert from './Alert';
import { AlertData } from './type';

export * from './type';

interface AddAlertContext {
  addAlert: (alertData: AlertData) => void;
}

const AlertContext = React.createContext<AddAlertContext>({
  addAlert: () => {},
});

export const useAlert = (): AddAlertContext => React.useContext(AlertContext);

const alertAnimation = {
  from: { opacity: 0 },
  enter: { opacity: 1 },
  leave: { opacity: 0 },
};

interface AlertState {
  alertList: AlertData[];
  currentAlert: AlertData | null;
}

const AlertProvider: React.FC<{}> = ({ children }) => {
  const [{ alertList, currentAlert }, setAlertListCtx] =
    React.useState<AlertState>({
      alertList: [],
      currentAlert: null,
    });
  const transitions = useTransition(currentAlert, alertAnimation);
  const alertContextValue = React.useMemo(
    () => ({
      addAlert: (alertData: AlertData) => {
        setAlertListCtx(prev => ({
          ...prev,
          alertList: [...prev.alertList, alertData],
        }));
      },
    }),
    [],
  );
  React.useEffect(() => {
    if (alertList.length && !currentAlert) {
      setAlertListCtx(({ alertList: [, ...restAlertList], ...prev }) => ({
        ...prev,
        currentAlert: alertList[0],
        alertList: restAlertList,
      }));
    }
  }, [alertList, currentAlert]);
  const onCloseAlert = React.useCallback(
    () => setAlertListCtx(prev => ({ ...prev, currentAlert: null })),
    [],
  );
  return (
    <AlertContext.Provider value={alertContextValue}>
      {children}
      {transitions(
        (animatedStyle, alert) =>
          alert && (
            <Alert
              style={animatedStyle}
              alert={alert}
              onCloseAlert={onCloseAlert}
            />
          ),
      )}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
