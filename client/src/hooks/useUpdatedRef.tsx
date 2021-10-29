import React from 'react';

const useUpdatedRef = <T,>(value: T): React.MutableRefObject<T> => {
  const ref = React.useRef(value);
  ref.current = value;
  return ref;
};

export default useUpdatedRef;
