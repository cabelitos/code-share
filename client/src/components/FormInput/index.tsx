import React from 'react';
import styled from 'styled-components';
import { animated, SpringValue } from '@react-spring/web';
import { Input } from '@react95/core';

const HorizontalContainer = styled(animated.div)`
  display: flex;
  flex: 1;
  margin-top: 20px;
`;

const StyledInput = styled(Input)`
  flex: 2;
  pointer-events: ${p => (p.disabled ? 'none' : 'auto')};
`;

const StyledLabel = styled.label`
  flex: 1;
`;

interface FormInputProps {
  id: string;
  label: string;
  onTextChanged: (evt: React.SyntheticEvent<InputEvent>) => void;
  style?: {
    opacity: SpringValue<number>;
  };
  text: string | null;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  onTextChanged,
  style,
  text,
  disabled,
}) => (
  <HorizontalContainer style={style}>
    <StyledLabel htmlFor={id}>{label}</StyledLabel>
    <StyledInput
      disabled={disabled}
      id={id}
      value={text}
      onChange={onTextChanged}
    />
  </HorizontalContainer>
);

export default FormInput;
