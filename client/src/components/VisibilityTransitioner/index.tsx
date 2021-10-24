import React from 'react';
import { useTransition, UseTransitionProps } from '@react-spring/web';

interface VisibilityTransitionerProps {
  isVisible: boolean;
  animationProps: UseTransitionProps;
}

const VisibilityTransitioner: React.FC<VisibilityTransitionerProps> = ({
  animationProps,
  children,
  isVisible,
}) => {
  const visibilityTransition = useTransition(isVisible, animationProps);
  return visibilityTransition(
    (animatedStyle, item) =>
      item &&
      React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { style: animatedStyle });
        }
        return child;
      }),
  );
};

export default VisibilityTransitioner;
