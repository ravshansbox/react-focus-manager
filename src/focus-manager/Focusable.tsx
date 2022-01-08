import { ComponentType, useEffect, useRef } from 'react';
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
  const ref = useRef<HTMLDivElement>(null);
  const focus = useFocus();

  const isFocused = ref.current === focus.getFocused();

  useEffect(() => {
    const node: Node = { onBlur, onFocus, ref: ref.current as HTMLDivElement };
    focus.add(node);
    return () => {
      focus.remove(node);
    };
  }, []);

  return (
    <div ref={ref} className={[className, isFocused && focusedClassName].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
};
