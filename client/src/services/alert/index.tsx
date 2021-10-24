import React from 'react';
import { Alert } from '@react95/core';
import { useTransition, animated } from '@react-spring/web';
import { useTranslation } from 'react-i18next';

export enum AlertType {
  ERROR = 'error',
  INFO = 'info',
}

interface AlertData {
  message: string;
  title: string;
  type: AlertType;
}

const AnimatedAlert = animated(Alert);

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
  const { t } = useTranslation('login');
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
  const okTxt = t('ok');
  const alertButtons = React.useMemo(
    () => [{ value: okTxt, onClick: onCloseAlert }],
    [onCloseAlert, okTxt],
  );
  return (
    <AlertContext.Provider value={alertContextValue}>
      {children}
      {transitions(
        (animatedStyle, alert) =>
          alert && (
            <AnimatedAlert
              buttons={alertButtons}
              closeAlert={onCloseAlert}
              message={alert.message}
              style={animatedStyle}
              title={alert.title}
              type={alert.type}
            />
          ),
      )}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
