import React from 'react';
import { Alert, TaskBar, List } from '@react95/core';
import { useTranslation } from 'react-i18next';
import { Computer3, Notepad as NotepadIcon, User } from '@react95/icons';

import Notepad from './Notepad';
import Interview from './Interview';
import { useAuth } from '../../services/auth';
import useIsOpen from './hooks/useIsOpen';
import VisibilityTransitioner from '../../components/VisibilityTransitioner';
import { useCurrentInterviewQuery } from '../../state/__generated__';
import { useAlert, AlertType } from '../../services/alert';

const ComputerIconStyled = <Computer3 variant="32x32_4" />;
const NotepadIconStyled = <NotepadIcon variant="32x32_4" />;
const UserIconStyled = <User variant="32x32_4" />;

const animationProps = {
  from: {
    opacity: 0,
    transform: 'translate3d(-50%, -50%, 0) scale(0, 0)',
  },
  enter: { opacity: 1, transform: 'translate3d(0%, 0%, 0) scale(1, 1)' },
  leave: { opacity: 0, transform: 'translate3d(-50%, -50%, 0) scale(0, 0)' },
};

const Home: React.FC<{}> = () => {
  const { t } = useTranslation('home');
  const { logout } = useAuth();
  const { addAlert } = useAlert();
  const { data } = useCurrentInterviewQuery({ fetchPolicy: 'network-only' });
  const interviewId = data?.currentInterview?.id ?? null;
  const [isNotepadOpen, onReallyOpenNotepad, onCloseNotepad] = useIsOpen(false);
  const [isExitAlertOpen, onOpenExitAlert, onCloseExitAlert] = useIsOpen(false);
  const [isInterviewOpen, onOpenInterview, onCloseInterview] = useIsOpen(true);
  const onOpenNotepad = React.useCallback(() => {
    if (interviewId) onReallyOpenNotepad();
    else
      addAlert({
        message: t('noInterviewMessage'),
        title: t('noInterviewTitle'),
        type: AlertType.ERROR,
      });
  }, [t, addAlert, onReallyOpenNotepad, interviewId]);

  const notepadTxt = t('notepad');
  const shutdownTxt = t('shutdown');
  const interviewTxt = t('interview');
  const taskBarList = React.useMemo(
    () => (
      <List>
        <List.Item icon={UserIconStyled} onClick={onOpenInterview}>
          {interviewTxt}
        </List.Item>
        <List.Item icon={NotepadIconStyled} onClick={onOpenNotepad}>
          {notepadTxt}
        </List.Item>
        <List.Divider />
        <List.Item icon={ComputerIconStyled} onClick={onOpenExitAlert}>
          {shutdownTxt}
        </List.Item>
      </List>
    ),
    [
      onOpenInterview,
      onOpenNotepad,
      onOpenExitAlert,
      notepadTxt,
      shutdownTxt,
      interviewTxt,
    ],
  );
  const alertButtons = React.useMemo(
    () => [
      { value: t('yes'), onClick: logout },
      { value: t('no'), onClick: onCloseExitAlert },
    ],
    [t, onCloseExitAlert, logout],
  );
  return (
    <>
      {isExitAlertOpen && (
        <Alert
          type="question"
          title={t('exitAlertTitle')}
          message={t('exitAlertMessage')}
          closeAlert={onCloseExitAlert}
          buttons={alertButtons}
        />
      )}
      <VisibilityTransitioner
        animationProps={animationProps}
        isVisible={isNotepadOpen}
      >
        <Notepad title={notepadTxt} onClose={onCloseNotepad} />
      </VisibilityTransitioner>
      <VisibilityTransitioner
        animationProps={animationProps}
        isVisible={isInterviewOpen}
      >
        <Interview
          interviewId={interviewId}
          onClose={onCloseInterview}
          title={interviewTxt}
        />
      </VisibilityTransitioner>
      <TaskBar list={taskBarList} />
    </>
  );
};

export default Home;
