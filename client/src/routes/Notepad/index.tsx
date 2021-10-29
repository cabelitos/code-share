import React from 'react';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import NotepadComponent from '../../components/Notepad';
import routeNames from '../routeNames';
import { useAuth } from '../../services/auth';
import { useCurrentInterviewQuery } from '../../state/__generated__';
import usePrevious from '../../hooks/usePrevious';
import useUpdatedRef from '../../hooks/useUpdatedRef';
import { AlertType, useAlert } from '../../services/alert';

const noOp = () => {};

const Notepad: React.FC<{}> = () => {
  const { t } = useTranslation('home');
  const { authData, logout } = useAuth();
  const { data, loading } = useCurrentInterviewQuery({
    fetchPolicy: 'network-only',
  });
  const interviewId = data?.currentInterview?.id ?? null;
  const previousInterviewId = usePrevious(interviewId);
  const logoutRef = useUpdatedRef(logout);
  const previousLoading = usePrevious(loading);
  const { addAlert } = useAlert();
  const addAlertRef = useUpdatedRef(addAlert);
  const tRef = useUpdatedRef(t);

  React.useEffect(() => {
    if (
      (!interviewId && previousInterviewId) ||
      (!loading && previousLoading && !interviewId)
    ) {
      logoutRef.current();
      addAlertRef.current({
        type: AlertType.ERROR,
        message: tRef.current('noActiveInterview'),
        title: tRef.current('noInterviewTitle'),
      });
    }
  }, [
    tRef,
    addAlertRef,
    interviewId,
    previousInterviewId,
    logoutRef,
    loading,
    previousLoading,
  ]);

  if (authData?.permissions.size) {
    return <Redirect to={routeNames.home} />;
  }
  return interviewId ? (
    <NotepadComponent onClose={noOp} title={t('notepad')} isFullscreen />
  ) : null;
};

export default Notepad;
