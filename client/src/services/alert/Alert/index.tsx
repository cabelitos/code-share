import React from 'react';
import { Alert as ReactAlert } from '@react95/core';
import { animated, SpringValue } from '@react-spring/web';
import { useTranslation } from 'react-i18next';

import type { AlertData } from '../type';

const AnimatedAlert = animated(ReactAlert);

interface AlertProps {
  onCloseAlert: () => void;
  style?: {
    opacity: SpringValue<number>;
  };
  alert: AlertData;
}

const Alert: React.FC<AlertProps> = ({
  onCloseAlert,
  style,
  alert: { message, title, type, buttons },
}) => {
  const { t } = useTranslation('login');
  const okTxt = t('ok');
  const alertButtons = React.useMemo(() => {
    if (!buttons || !buttons.length) {
      return [{ value: okTxt, onClick: onCloseAlert }];
    }
    return buttons.map(b => ({
      ...b,
      onClick: () => {
        b.onClick?.();
        onCloseAlert();
      },
    }));
  }, [onCloseAlert, okTxt, buttons]);
  return (
    <AnimatedAlert
      buttons={alertButtons}
      closeAlert={onCloseAlert}
      message={message}
      style={style}
      title={title}
      type={type}
    />
  );
};

export default Alert;
