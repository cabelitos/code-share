import React from 'react';
import { Button } from '@react95/core';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  min-width: 200px;
`;

const Submit: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...rest
}) => <StyledButton {...rest}>{children}</StyledButton>;

export default Submit;
