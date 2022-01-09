import { ComponentType, useEffect, useRef, useState } from 'react';
import { Node, useFocus } from './FocusContext';

type FocusableProps = {
  className?: string;
  focusedClassName?: string;
  onBlur?: () => void;
  onFocus?: () => void;
};

export const Focusable: ComponentType<FocusableProps> = ({
  children,
  className,
  focusedClassName = 'focused',
  onBlur,
  onFocus,
}) => {
  const [isFocused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const focus = useFocus();

  useEffect(() => {
    const node: Node = {
      onBlur: () => {
        setFocused(false);
        if (onBlur) {
          onBlur();
        }
      },
      onFocus: () => {
        setFocused(true);
        if (onFocus) {
          onFocus();
        }
      },
      element: ref.current as HTMLDivElement,
    };
    focus.addNode(node);
    return () => {
      focus.removeNode(node);
    };
  }, []);

  return (
    <div ref={ref} className={[className, isFocused && focusedClassName].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
};
