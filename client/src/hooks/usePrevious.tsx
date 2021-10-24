import React from 'react';

const usePrevious = <T,>(value: T, initialValue?: T): T | undefined => {
  const ref = React.useRef(initialValue);
  React.useEffect((): void => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export default usePrevious;
