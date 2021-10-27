import React from 'react';
import { Button } from '@react95/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Keys } from '@react95/icons';

import FormInput from '../../../components/FormInput';
import useOnInputValue from '../../../hooks/useOnInputValue';
import { useAuth } from '../../../services/auth';

const StyledForm = styled.form`
  align-items: center;
  display: flex;
  flex: 1;
`;

const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 30px;
`;

const StyledKeys = styled(Keys)`
  height: 64px;
  width: 64px;
`;

const StyledButton = styled(Button)`
  margin-top: 30px;
`;

const Form: React.FC<{}> = () => {
  const { t } = useTranslation('login');

  const [email, onEmailChanged] = useOnInputValue('');
  const { sendLoginEmail } = useAuth();

  const onLogin = React.useCallback(
    e => {
      e.preventDefault();
      const trimmedEmail = email.trim();
      if (trimmedEmail !== '') {
        sendLoginEmail(
          trimmedEmail,
          t('emailSentTitle'),
          t('emailSentMessage'),
        );
      }
    },
    [sendLoginEmail, email, t],
  );

  return (
    <StyledForm>
      <StyledKeys />
      <VerticalContainer>
        {t('addCredentials')}
        <FormInput
          id="email"
          label={t('email')}
          onTextChanged={onEmailChanged}
          text={email}
        />
        <StyledButton onClick={onLogin}>{t('login')}</StyledButton>
      </VerticalContainer>
    </StyledForm>
  );
};

export default Form;
