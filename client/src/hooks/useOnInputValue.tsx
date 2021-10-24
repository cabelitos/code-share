import React from 'react';

const useOnInputValue = <T,>(
  initialValue: T,
): [T, (evt: React.SyntheticEvent<InputEvent>) => void, () => void] => {
  const initialValueRef = React.useRef(initialValue);
  const [value, setValue] = React.useState(initialValue);
  const onValueChanged = React.useCallback(evt => {
    setValue(evt.target.value);
  }, []);
  const resetValue = React.useCallback(
    () => setValue(initialValueRef.current),
    [],
  );
  return [value, onValueChanged, resetValue];
};

export default useOnInputValue;
