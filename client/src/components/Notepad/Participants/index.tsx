import React from 'react';
import { Fieldset, Tree } from '@react95/core';
import { useTranslation } from 'react-i18next';
import { User } from '@react95/icons';
import styled from 'styled-components';
import { useSocket } from '../../../services/socket';

const UserIconStyled = <User variant="16x16_4" />;

const StyledFieldset = styled(Fieldset)`
  min-width: 15vw;
`;

const Participants: React.FC<{}> = () => {
  const { t } = useTranslation('notepad');
  const { participants } = useSocket();
  const data = React.useMemo(
    () =>
      participants.map((email, i) => ({
        id: i,
        label: email,
        icon: UserIconStyled,
      })),
    [participants],
  );
  return (
    <StyledFieldset legend={t('participants')}>
      <Tree data={data} />
    </StyledFieldset>
  );
};

export default Participants;
