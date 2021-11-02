import React from 'react';
import { Checkbox } from '@react95/core';
import { useTranslation } from 'react-i18next';

import InterviewForm from '../InterviewForm';
import { useAuth } from '../../../../services/auth';
import { useCreateInterviewMutation } from '../../../../state/__generated__';

interface CreateInterviewProps {
  isOnInterview: boolean;
  onOpenNotepad: () => void;
}

const CreateInterview: React.FC<CreateInterviewProps> = ({
  isOnInterview,
  onOpenNotepad,
}) => {
  const { t } = useTranslation('interview');
  const [shouldSendEmailLink, setShouldSendEmailLink] = React.useState(true);
  const [createInterview] = useCreateInterviewMutation();
  const { sendLoginEmail } = useAuth();
  const onSubmit = React.useCallback(
    async (interviewee: string) => {
      const { data } = await createInterview({
        variables: { input: { interviewee } },
      });
      const interviewId = data?.createInterview.id;
      if (!interviewId) return;
      if (!shouldSendEmailLink) {
        onOpenNotepad();
        return;
      }
      sendLoginEmail({
        email: interviewee,
        successTitle: t('sendLoginLinkSuccessTitle'),
        successMessage: t('sendLoginLinkSuccessMessage'),
        shouldTriggerLoading: false,
        successModalButtons: [
          {
            value: t('ok'),
            onClick: onOpenNotepad,
          },
        ],
      });
    },
    [createInterview, sendLoginEmail, t, onOpenNotepad, shouldSendEmailLink],
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
