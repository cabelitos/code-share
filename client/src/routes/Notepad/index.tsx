import React from 'react';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import NotepadComponent from '../../components/Notepad';
import routeNames from '../routeNames';
import { useAuth } from '../../services/auth';
import { useCurrentInterviewQuery } from '../../state/__generated__';

const noOp = () => {};

const Notepad: React.FC<{}> = () => {
  const { t } = useTranslation('home');
  const { authData } = useAuth();
  const { data } = useCurrentInterviewQuery({ fetchPolicy: 'network-only' });
  const interviewId = data?.currentInterview?.id ?? null;

  if (authData?.permissions.size) {
    return <Redirect to={routeNames.home} />;
  }
  return interviewId ? (
    <NotepadComponent onClose={noOp} title={t('notepad')} isFullscreen />
  ) : null;
};

export default Notepad;
