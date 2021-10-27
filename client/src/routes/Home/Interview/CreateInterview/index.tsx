import React from 'react';
import { Checkbox } from '@react95/core';
import { useTranslation } from 'react-i18next';

import InterviewForm from '../InterviewForm';
import { useAuth } from '../../../../services/auth';
import { useCreateInterviewMutation } from '../../../../state/__generated__';

interface CreateInterviewProps {
  isOnInterview: boolean;
}

const CreateInterview: React.FC<CreateInterviewProps> = ({ isOnInterview }) => {
  const { t } = useTranslation('interview');
  const [shouldSendEmailLink, setShouldSendEmailLink] = React.useState(true);
  const [createInterview] = useCreateInterviewMutation();
  const { sendLoginEmail } = useAuth();
  const onSubmit = React.useCallback(
    (interviewee: string) =>
      createInterview({
        variables: { input: { interviewee } },
      }).then(() =>
        sendLoginEmail(
          interviewee,
          t('sendLoginLinkSuccessTitle'),
          t('bbsendLoginLinkSuccessMessage'),
          false,
        ),
      ),
    [createInterview, sendLoginEmail, t],
  );
  const onCheckBoxChanged = React.useCallback(
    () => setShouldSendEmailLink(prev => !prev),
    [],
  );
  return (
    <InterviewForm
      label={t('intervieweeEmail')}
      isDisabled={isOnInterview}
      id="intervieweeEmail"
      buttonText={t('create')}
      onSubmit={onSubmit}
    >
      <Checkbox
        checked={shouldSendEmailLink}
        onChange={onCheckBoxChanged}
        disabled={isOnInterview}
      >
        {t('sendLoginLink')}
      </Checkbox>
    </InterviewForm>
  );
};

export default CreateInterview;
