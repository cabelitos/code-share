import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const StyledH1 = styled.h1`
  hyphens: none;
  max-width: 40vw;
  overflow-wrap: break-word;
  text-align: center;
  word-wrap: break-word;
`;

interface CurrentInterviewProps {
  interviewCode: string | null;
}

const CurrentInterview: React.FC<CurrentInterviewProps> = ({
  interviewCode,
}) => {
  const { t } = useTranslation('interview');
  return <StyledH1>{interviewCode || t('createOrJoinInterview')}</StyledH1>;
};

export default CurrentInterview;
