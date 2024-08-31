import {
  ComponentType,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Node, useFocus } from './FocusContext';

type FocusableProps = {
  className?: string;
  focusedClassName?: string;
  focusOnHover?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
};

export const Focusable: ComponentType<PropsWithChildren<FocusableProps>> = ({
  children,
  className,
  focusedClassName = 'focused',
  focusOnHover,
  onBlur,
  onFocus,
}) => {
  const [isFocused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const focus = useFocus();

  const onMouseOver =
    focusOnHover === true
      ? () => {
          focus.focusElement(ref.current as HTMLDivElement);
        }
      : undefined;

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
    <div
      ref={ref}
      className={[className, isFocused && focusedClassName]
        .filter(Boolean)
        .join(' ')}
      onMouseOver={onMouseOver}
    >
      {children}
    </div>
  );
};
