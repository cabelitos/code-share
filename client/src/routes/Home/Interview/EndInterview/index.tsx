import React from 'react';
import { useTranslation } from 'react-i18next';

import Submit from '../Submit';
import { useEndInterviewMutation } from '../../../../state/__generated__';

interface EndInterviewProps {
  isOnInterview: boolean;
  interviewId: string | null;
}

const EndInterview: React.FC<EndInterviewProps> = ({
  isOnInterview,
  interviewId,
}) => {
  const { t } = useTranslation('interview');
  const [endInterview] = useEndInterviewMutation();
  const onSubmit = React.useCallback(
    e => {
      e.preventDefault();
      if (interviewId) endInterview({ variables: { input: { interviewId } } });
    },
    [endInterview, interviewId],
  );
  return (
    <Submit disabled={!isOnInterview} onClick={onSubmit}>
      {t('end')}
    </Submit>
  );
};

export default EndInterview;
