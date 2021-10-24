import React from 'react';
import { useTranslation } from 'react-i18next';

import InterviewForm from '../InterviewForm';
import { useCreateInterviewMutation } from '../../../../state/__generated__';

interface CreateInterviewProps {
  isOnInterview: boolean;
}

const CreateInterview: React.FC<CreateInterviewProps> = ({ isOnInterview }) => {
  const { t } = useTranslation('interview');
  const [createInterview] = useCreateInterviewMutation();
  const onSubmit = React.useCallback(
    (interviewee: string) =>
      createInterview({
        variables: { input: { interviewee } },
      }),
    [createInterview],
  );
  return (
    <InterviewForm
      label={t('intervieweeEmail')}
      isDisabled={isOnInterview}
      id="intervieweeEmail"
      buttonText={t('create')}
      onSubmit={onSubmit}
    />
  );
};

export default CreateInterview;
