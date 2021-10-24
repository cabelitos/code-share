import React from 'react';
import { Modal } from '@react95/core';
import { MsDos } from '@react95/icons';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Form from './Form';

const noOp = () => {};

const ModalIcon = <MsDos />;

const StyledModal = styled(Modal)`
  display: flex;
  height: 30vh;
  width: 40vw;
`;

const Container = styled.div`
  align-items: center;
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
`;

const Login: React.FC<{}> = () => {
  const { t } = useTranslation('login');
  return (
    <Container>
      <StyledModal
        icon={ModalIcon}
        title={t('welcome')}
        closeModal={noOp}
        hasWindowButton={false}
      >
        <Form />
      </StyledModal>
    </Container>
  );
};

export default Login;
