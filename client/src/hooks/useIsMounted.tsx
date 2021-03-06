import React from 'react';

const useIsMounted = (): React.MutableRefObject<boolean> => {
  const isMountedRef = React.useRef(false);
  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  });
  return isMountedRef;
};

export default useIsMounted;
