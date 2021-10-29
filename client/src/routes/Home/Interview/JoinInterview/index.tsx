import React from 'react';
import { useTranslation } from 'react-i18next';

import InterviewForm from '../InterviewForm';
import { useJoinInterviewMutation } from '../../../../state/__generated__';

interface JoinInterviewProps {
  isOnInterview: boolean;
  onOpenNotepad: () => void;
}

const JoinInterview: React.FC<JoinInterviewProps> = ({
  isOnInterview,
  onOpenNotepad,
}) => {
  const { t } = useTranslation('interview');
  const [joinInterview] = useJoinInterviewMutation();
  const onSubmit = React.useCallback(
    async (interviewId: string) => {
      const { data } = await joinInterview({
        variables: { input: { interviewId } },
      });
      const joinedInterviewId = data?.joinInterview.id;
      if (!joinedInterviewId) return;
      onOpenNotepad();
    },
    [joinInterview, onOpenNotepad],
  );
  return (
    <InterviewForm
      label={t('interviewCode')}
      isDisabled={isOnInterview}
      id="interviewCode"
      buttonText={t('join')}
      onSubmit={onSubmit}
    />
  );
};

export default JoinInterview;
