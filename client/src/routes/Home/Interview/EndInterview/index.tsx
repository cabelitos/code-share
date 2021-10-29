import React from 'react';
import { useTranslation } from 'react-i18next';

import Submit from '../Submit';
import { useEndInterviewMutation } from '../../../../state/__generated__';
import { AlertType, useAlert } from '../../../../services/alert';

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
  const { addAlert } = useAlert();
  const onSubmit = React.useCallback(
    e => {
      e.preventDefault();
      if (!interviewId) return;
      addAlert({
        type: AlertType.INFO,
        message: t('endInterviewMessage'),
        title: t('endInterviewTitle'),
        buttons: [
          {
            value: t('end'),
            onClick: () => {
              endInterview({ variables: { input: { interviewId } } });
            },
          },
          {
            value: t('cancel'),
          },
        ],
      });
    },
    [addAlert, endInterview, interviewId, t],
  );
  return (
    <Submit disabled={!isOnInterview} onClick={onSubmit}>
      {t('end')}
    </Submit>
  );
};

export default EndInterview;
