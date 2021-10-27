import { useEffect, useState } from 'react';

function useDebounced<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    let timer: null | NodeJS.Timeout = setTimeout(() => {
      setDebouncedValue(value);
      timer = null;
    }, delay || 500);

    return () => {
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounced;
