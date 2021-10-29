import React from 'react';
import { Modal, Fieldset } from '@react95/core';
import { User } from '@react95/icons';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { animated, SpringValue } from '@react-spring/web';

import EndInterview from './EndInterview';
import JoinInterview from './JoinInterview';
import CreateInterview from './CreateInterview';
import CurrentInterview from './CurrentInterview';
import { useAuth } from '../../../services/auth';
import { Permissions } from '../../../services/auth/permissions';

const UserIconStyled = <User variant="16x16_4" />;

const StyledModal = styled(animated(Modal))`
  width: 50vw;
`;

const StyledFieldset = styled(Fieldset)`
  align-items: center;
  display: flex;
  justify-content: center;
`;

interface InterviewProps {
  onClose: () => void;
  title: string;
  onOpenNotepad: () => void;
  interviewId: string | null;
  style?: {
    opacity: SpringValue<number>;
    transform: SpringValue<string>;
  };
}

const Interview: React.FC<InterviewProps> = ({
  interviewId,
  onClose,
  style,
  onOpenNotepad,
  title,
}) => {
  const { t } = useTranslation('interview');
  const { hasPermission } = useAuth();
  const isOnInterview = !!interviewId;
  return (
    <StyledModal
      style={style}
      icon={UserIconStyled}
      title={title}
      closeModal={onClose}
    >
      <StyledFieldset legend={t('interviewCode')}>
        <CurrentInterview interviewCode={interviewId} />
      </StyledFieldset>
      <Fieldset legend={t('joinInterview')}>
        <JoinInterview
          onOpenNotepad={onOpenNotepad}
          isOnInterview={isOnInterview}
        />
      </Fieldset>
      {hasPermission(Permissions.CREATE_INTERVIEW) && (
        <Fieldset legend={t('createInterview')}>
          <CreateInterview
            onOpenNotepad={onOpenNotepad}
            isOnInterview={isOnInterview}
          />
        </Fieldset>
      )}
      {hasPermission(Permissions.END_INTERVIEW) && (
        <StyledFieldset legend={t('endInterview')}>
          <EndInterview
            interviewId={interviewId}
            isOnInterview={isOnInterview}
          />
        </StyledFieldset>
      )}
    </StyledModal>
  );
};

export default Interview;
