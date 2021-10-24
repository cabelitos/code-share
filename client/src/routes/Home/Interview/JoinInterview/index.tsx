import React from 'react';
import { useTranslation } from 'react-i18next';

import InterviewForm from '../InterviewForm';
import { useJoinInterviewMutation } from '../../../../state/__generated__';

interface JoinInterviewProps {
  isOnInterview: boolean;
}

const JoinInterview: React.FC<JoinInterviewProps> = ({ isOnInterview }) => {
  const { t } = useTranslation('interview');
  const [joinInterview] = useJoinInterviewMutation();
  const onSubmit = React.useCallback(
    (interviewId: string) =>
      joinInterview({ variables: { input: { interviewId } } }),
    [joinInterview],
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
