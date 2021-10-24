import React from 'react';
import styled from 'styled-components';

import FormInput from '../../../../components/FormInput';
import Submit from '../Submit';
import useOnInputValue from '../../../../hooks/useOnInputValue';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

interface InterviewFormProps {
  isDisabled: boolean;
  id: string;
  label: string;
  buttonText: string;
  onSubmit: (val: string) => Promise<unknown>;
}

const InterviewForm: React.FC<InterviewFormProps> = ({
  isDisabled,
  id,
  label,
  buttonText,
  onSubmit,
}) => {
  const [value, onValueChanged, resetValue] = useOnInputValue('');
  const onJoinInterview = React.useCallback(
    e => {
      e.preventDefault();
      if (isDisabled) return;
      const trimmedValue = value.trim();
      if (trimmedValue === '') {
        return;
      }
      onSubmit(trimmedValue).then(resetValue);
    },
    [value, isDisabled, onSubmit, resetValue],
  );
  return (
    <StyledForm>
      <FormInput
        disabled={isDisabled}
        id={id}
        label={label}
        text={value}
        onTextChanged={onValueChanged}
      />
      <ButtonContainer>
        <Submit disabled={isDisabled} onClick={onJoinInterview}>
          {buttonText}
        </Submit>
      </ButtonContainer>
    </StyledForm>
  );
};

export default InterviewForm;
