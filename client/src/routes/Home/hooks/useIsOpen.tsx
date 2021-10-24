import React from 'react';

type ReturnType = [boolean, () => void, () => void];

const useIsOpen = (initialValue: boolean): ReturnType => {
  const [isOpen, setIsOpen] = React.useState(initialValue);
  const onClose = React.useCallback(() => {
    setIsOpen(false);
  }, []);
  const onOpen = React.useCallback(() => {
    setIsOpen(true);
  }, []);
  return [isOpen, onOpen, onClose];
};

export default useIsOpen;
